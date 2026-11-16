import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useSelector } from "@xstate/react";

import { Modal } from "components/ui/Modal";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  AnimalBuildingModal,
  hasReadGuide,
} from "features/game/expansion/components/animals/AnimalBuildingModal";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";
import {
  AnimalDeal,
  ExchangeHud,
} from "features/barn/components/AnimalBounties";
import { AnimalBountySellPanel } from "features/barn/components/AnimalBountySellPanel";
import { PendingSaleTag } from "features/barn/components/AnimalBountyQuickPanel";
import { useBountySaleSelection } from "features/barn/lib/useBountySaleSelection";
import { FeederMachineModal } from "features/feederMachine/FeederMachineModal";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import type { AnimalBounty, InventoryItemName } from "features/game/types/game";
import { getValues } from "lib/object";
import type { AnimalDealState, GameBridge } from "../bridge/GameBridge";
import { useWorldAnchor } from "../bridge/useWorldAnchor";
import { animalSaleAnchorId } from "../entities/animals/animalInteraction";

/**
 * The animal house's React half [barn/BarnInside.tsx +
 * henHouse/HenHouseInside.tsx]: the buy/sell, upgrade and feeder-machine
 * panels, plus the bounty-exchange (deal) flow and its screen-space HUD.
 *
 * The in-room controls that open the first three — the feeder machine, Feed
 * All, and the shop/upgrade discs — are Phaser now
 * [entities/animals/AnimalHouseControls.ts]. They sit on the room and move
 * with it, so hosting them as DOM elements chasing the `interior-room` anchor
 * was the boundary violation the architecture guide warns about. They ask for
 * a panel through `bridge.animalHouseModal`; this component renders it.
 *
 * The deal handshake runs through `bridge.animalDeal`: the sell tab (or the
 * quick-sell panel the skull disc docks) sets the deal, the renderer dims
 * invalid animals and reports the clicked animal via `clickedId`, and this
 * component confirms it through the AnimalDeal modal — or, in the panel's
 * bulk mode, marks the pair [useBountySaleSelection] and shows its
 * PendingSaleTag over the animal.
 */

/** [BarnInside.tsx / HenHouseInside.tsx AnimalBountySellPanel animalTypes] */
const SELL_PANEL_ANIMALS: Record<"barn" | "henHouse", InventoryItemName[]> = {
  barn: ["Cow", "Sheep"],
  henHouse: ["Chicken"],
};

/**
 * The store is non-null exactly while a deal is picked or the sell panel is
 * open — the Hud, the exit button and the room discs key off that.
 */
const publishSale = (bridge: GameBridge, next: NonNullable<AnimalDealState>) =>
  bridge.animalDeal.set(next.deal || next.sellPanel ? next : null);

/**
 * [BarnInside.tsx PendingSaleTag] the bounty's reward over an animal marked
 * for it, hung off the cell anchor the renderer registers.
 */
const AnchoredSaleTag: React.FC<{ animalId: string; dealId: string }> = ({
  animalId,
  dealId,
}) => {
  const rect = useWorldAnchor(animalSaleAnchorId(animalId));
  if (!rect?.visible) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }}
    >
      <PendingSaleTag dealId={dealId} />
    </div>
  );
};

const _building = (key: "barn" | "henHouse") => (state: MachineState) =>
  state.context.state[key];
const _state = (state: MachineState) => state.context.state;

export const AnimalHouseUI: React.FC<{
  bridge: GameBridge;
  building: "barn" | "henHouse";
}> = ({ bridge, building }) => {
  const { gameService } = useContext(Context);
  const buildingName = building === "barn" ? "Barn" : "Hen House";
  const buildingState = useSelector(gameService, _building(building));
  const game = useSelector(gameService, _state);

  // [BarnInside.tsx] the buy/sell modal auto-opens until the guide is read.
  const [showShop, setShowShop] = useState(!hasReadGuide());
  const [showUpgrade, setShowUpgrade] = useState(false);

  const dealState = useSyncExternalStore(
    (onChange) => bridge.animalDeal.subscribe(onChange),
    () => bridge.animalDeal.get(),
  );
  const deal = dealState?.deal;
  // [BarnInside.tsx showSellPanel] the quick-sell flow: the skull disc docks
  // the bounty cards at the bottom of the screen instead of opening the shop
  // modal's Sell tab.
  const sellPanel = !!dealState?.sellPanel;
  const saleSelection = useBountySaleSelection(building);
  const { pending } = saleSelection;

  const setDeal = (next?: AnimalBounty) =>
    publishSale(bridge, { ...bridge.animalDeal.get(), deal: next });
  const setSelectedId = (selectedId?: string) =>
    publishSale(bridge, { ...bridge.animalDeal.get(), selectedId });

  // The renderer dims and unmarks from the bulk marks, so mirror them out.
  useEffect(() => {
    const state = bridge.animalDeal.get();
    if (!state) return;
    bridge.animalDeal.set({ ...state, pending });
  }, [bridge, pending]);

  // Leaving the room ends the sale — the store outlives this component.
  useEffect(() => () => bridge.animalDeal.set(null), [bridge]);

  // The click handler below runs from the store, outside React's render.
  const saleSelectionRef = useRef(saleSelection);
  useEffect(() => {
    saleSelectionRef.current = saleSelection;
  });

  // [BarnInside.tsx animal wrapper onClick + handleAnimalSale] what a click
  // the renderer reported does.
  useEffect(
    () =>
      bridge.animalDeal.subscribe((state) => {
        const animalId = state?.clickedId;
        if (!state || !animalId) return;

        const sale = saleSelectionRef.current;
        const rest = { ...state, clickedId: undefined };
        const clickedDeal = state.deal;

        // Bulk mode: clicking a marked animal removes its mark.
        if (!clickedDeal) {
          const dealId = Object.keys(state.pending ?? {}).find(
            (id) => state.pending?.[id] === animalId,
          );
          if (dealId) sale.unselect(dealId);
          return publishSale(bridge, rest);
        }

        // The shop modal's Sell tab: always the AnimalDeal confirmation.
        if (!state.sellPanel) {
          return publishSale(bridge, { ...rest, selectedId: animalId });
        }

        // Quick-sell (panel) flow: a single sale always confirms through
        // AnimalDeal, so a stray click never sells an animal. Bulk mode marks
        // pairs instead and sells them together.
        const currentGame = gameService.getSnapshot().context.state;
        const animal = currentGame[building].animals[animalId];
        const isCompleted = currentGame.bounties.completed.some(
          (completed) => completed.id === clickedDeal.id,
        );
        if (
          !animal ||
          isCompleted ||
          !isValidDeal({ animal, deal: clickedDeal, game: currentGame })
        ) {
          return publishSale(bridge, rest);
        }

        // Bulk mode marks the pair; it sells from the panel's confirm button.
        // Sick animals (reduced bounty) and animals with an attached reward
        // always get the AnimalDeal confirmation.
        if (
          sale.bulkMode &&
          animal.state !== "sick" &&
          !animal.reward?.items?.[0]?.name
        ) {
          sale.select(clickedDeal.id, animalId);
          return publishSale(bridge, { ...rest, deal: undefined });
        }

        publishSale(bridge, { ...rest, selectedId: animalId });
      }),
    [bridge, building, gameService],
  );

  const validAnimalsCount = useMemo(() => {
    if (!deal) return 0;
    return getValues(buildingState.animals).filter((animal) =>
      isValidDeal({ animal, deal, game }),
    ).length;
  }, [buildingState.animals, deal, game]);

  const level = Math.min(buildingState.level, 3);
  const nextLevel = Math.min(level + 1, 3);

  // Which panel the in-room Phaser controls have asked for.
  const requested = useSyncExternalStore(
    (onChange) => bridge.animalHouseModal.subscribe(onChange),
    () => bridge.animalHouseModal.get(),
  );
  const clearRequest = () => bridge.animalHouseModal.set(null);

  return (
    <>
      <Modal
        show={showShop || requested === "shop"}
        onHide={() => {
          setShowShop(false);
          clearRequest();
        }}
      >
        <AnimalBuildingModal
          buildingName={buildingName}
          onClose={() => {
            setShowShop(false);
            clearRequest();
          }}
          onExchanging={(bounty) => {
            setShowShop(false);
            clearRequest();
            bridge.animalDeal.set({ deal: bounty });
          }}
        />
      </Modal>

      <UpgradeBuildingModal
        buildingName={buildingName}
        currentLevel={level}
        nextLevel={nextLevel}
        show={showUpgrade || requested === "upgrade"}
        onClose={() => {
          setShowUpgrade(false);
          clearRequest();
        }}
      />

      <FeederMachineModal
        show={requested === "feeder"}
        onClose={clearRequest}
        building={buildingName}
      />

      {/* Quick-sell panel [BarnInside.tsx showSellPanel] */}
      {sellPanel && (
        <AnimalBountySellPanel
          animalTypes={SELL_PANEL_ANIMALS[building]}
          selectedDeal={deal}
          bulkMode={saleSelection.bulkMode}
          onBulkModeChange={(enabled) => {
            saleSelection.setBulkMode(enabled);
            setDeal(undefined);
          }}
          pendingSales={pending}
          onSelect={(selected) => {
            if (selected && pending[selected.id]) {
              saleSelection.unselect(selected.id);
              setDeal(undefined);
              return;
            }
            setDeal(selected);
          }}
          onSellPending={saleSelection.sellAll}
          onClearPending={saleSelection.clear}
          onClose={() => {
            bridge.animalDeal.set(null);
            saleSelection.setBulkMode(false);
          }}
        />
      )}

      {/* Bulk marks [BarnInside.tsx PendingSaleTag] */}
      {Object.entries(pending).map(([dealId, animalId]) => (
        <AnchoredSaleTag key={animalId} animalId={animalId} dealId={dealId} />
      ))}

      {/* Deal mode [BarnInside.tsx]: modal for the clicked animal + HUD */}
      <Modal
        show={!!dealState?.selectedId && !!deal}
        onHide={() => setSelectedId(undefined)}
      >
        <AnimalDeal
          deal={deal}
          animalId={dealState?.selectedId}
          onClose={() => setSelectedId(undefined)}
          onSold={() =>
            publishSale(bridge, {
              ...bridge.animalDeal.get(),
              deal: undefined,
              selectedId: undefined,
            })
          }
        />
      </Modal>

      {deal && !sellPanel && (
        <ExchangeHud
          deal={deal}
          onClose={() => setDeal(undefined)}
          validAnimalsCount={validAnimalsCount}
        />
      )}
    </>
  );
};
