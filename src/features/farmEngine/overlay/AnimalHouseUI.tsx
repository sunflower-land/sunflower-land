import type { AnimalBuildingKey } from "features/game/types/game";
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
import type { AnimalBuildingType } from "features/game/types/animals";
import { ITEM_DETAILS } from "features/game/types/images";
import { canTradeInPig, getPigBristles } from "features/game/lib/animals";
import { useApplyMud } from "features/pigpen/components/ApplyMudButton";
import {
  TradeInHud,
  TradeInPigModal,
} from "features/pigpen/components/TradeInPig";
import { Label } from "components/ui/Label";
import { useNow } from "lib/utils/hooks/useNow";
import { getValues } from "lib/object";
import type { AnimalDealState, GameBridge } from "../bridge/GameBridge";
import { useWorldAnchor } from "../bridge/useWorldAnchor";
import {
  animalSaleAnchorId,
  animalTradeInAnchorId,
} from "../entities/animals/animalInteraction";

/**
 * The animal house's React half [barn/BarnInside.tsx +
 * henHouse/HenHouseInside.tsx + pigpen/PigpenInside.tsx]: the buy/sell,
 * upgrade and feeder-machine panels, plus the bounty-exchange (deal) flow and
 * its screen-space HUD. The pigpen adds the trade-in pick (the same handshake
 * with `tradeIn` in place of a deal) and Apply Mud's confirmation.
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
const SELL_PANEL_ANIMALS: Record<AnimalBuildingKey, InventoryItemName[]> = {
  barn: ["Cow", "Sheep"],
  henHouse: ["Chicken"],
  pigpen: ["Pig"],
};

const BUILDING_NAME: Record<AnimalBuildingKey, AnimalBuildingType> = {
  barn: "Barn",
  henHouse: "Hen House",
  pigpen: "Pigpen",
};

/**
 * The store is non-null exactly while a deal is picked, the sell panel is
 * open or a Pig is being picked for a trade-in — the Hud, the exit button and
 * the room discs key off that.
 */
const publishSale = (bridge: GameBridge, next: NonNullable<AnimalDealState>) =>
  bridge.animalDeal.set(
    next.deal || next.sellPanel || next.tradeIn ? next : null,
  );

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

/**
 * [PigpenInside.tsx isTradeable Label] what a tradeable Pig pays, so the pick
 * is informed — hung off the cell anchor the renderer registers.
 */
const AnchoredTradeInLabel: React.FC<{ amount: number; animalId: string }> = ({
  amount,
  animalId,
}) => {
  const rect = useWorldAnchor(animalTradeInAnchorId(animalId));
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
      <Label
        type="warning"
        icon={ITEM_DETAILS["Pig Bristles"].image}
        className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap pointer-events-none"
      >
        {amount}
      </Label>
    </div>
  );
};

/**
 * [ApplyMudButton.tsx] the in-room disc is Phaser [AnimalHouseControls]; its
 * click runs the button's own flow [useApplyMud] — the explain-and-confirm
 * modal, "Don't ask again", the live re-check and `pigs.bulkMudApplied`.
 */
const ApplyMudHost: React.FC<{ bridge: GameBridge; requested: boolean }> = ({
  bridge,
  requested,
}) => {
  const { request, confirm } = useApplyMud();

  useEffect(() => {
    if (!requested) return;
    bridge.animalHouseModal.set(null);
    request();
    // Only a new request from the disc should run it, not a re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridge, requested]);

  return confirm;
};

const _building = (key: AnimalBuildingKey) => (state: MachineState) =>
  state.context.state[key];
const _state = (state: MachineState) => state.context.state;

export const AnimalHouseUI: React.FC<{
  bridge: GameBridge;
  building: AnimalBuildingKey;
}> = ({ bridge, building }) => {
  const { gameService } = useContext(Context);
  const buildingName = BUILDING_NAME[building];
  const isPigpen = building === "pigpen";
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

  // [PigpenInside.tsx] the trade-in flow: the dock's first card (or the shop
  // modal's Sell tab) enters a pick-a-Pig mode like a bounty; the chosen Pig
  // is confirmed in its own modal.
  const tradeInMode = isPigpen && !!dealState?.tradeIn;
  const [tradeInPigId, setTradeInPigId] = useState<string>();
  const now = useNow({ live: true, intervalMs: 60_000 });
  const setTradeInMode = (tradeIn: boolean) =>
    publishSale(bridge, { ...bridge.animalDeal.get(), tradeIn });

  // [PigpenInside.tsx] every deal change leaves the trade-in pick.
  const setDeal = (next?: AnimalBounty) =>
    publishSale(bridge, {
      ...bridge.animalDeal.get(),
      deal: next,
      tradeIn: false,
    });
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

        // [PigpenInside.tsx tradeInMode] the picked Pig's confirmation.
        if (!clickedDeal && state.tradeIn) {
          setTradeInPigId(animalId);
          return publishSale(bridge, rest);
        }

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

  // [PigpenInside.tsx tradeableCount / isTradeable] a Pig marked for a bulk
  // sale can't also be traded in.
  const tradeablePigs = useMemo(() => {
    if (!tradeInMode) return [];
    const marked = new Set(Object.values(pending));
    return getValues(buildingState.animals)
      .filter((pig) => canTradeInPig({ pig, game, now }))
      .map((pig) => ({ pig, labelled: !marked.has(pig.id) }));
  }, [buildingState.animals, tradeInMode, game, now, pending]);

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
          onTradeIn={
            isPigpen
              ? () => {
                  setShowShop(false);
                  clearRequest();
                  bridge.animalDeal.set({ tradeIn: true });
                }
              : undefined
          }
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

      {/* [ApplyMudButton.tsx] */}
      {isPigpen && (
        <ApplyMudHost bridge={bridge} requested={requested === "applyMud"} />
      )}

      {/* [PigpenInside.tsx] the trade-in confirmation */}
      {isPigpen && (
        <Modal show={!!tradeInPigId} onHide={() => setTradeInPigId(undefined)}>
          <TradeInPigModal
            pigId={tradeInPigId}
            onClose={() => setTradeInPigId(undefined)}
            onTradedIn={() => {
              setTradeInPigId(undefined);
              setTradeInMode(false);
            }}
          />
        </Modal>
      )}

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
          tradeIn={
            isPigpen
              ? {
                  selected: tradeInMode,
                  onSelect: () =>
                    publishSale(bridge, {
                      ...bridge.animalDeal.get(),
                      deal: undefined,
                      tradeIn: !bridge.animalDeal.get()?.tradeIn,
                    }),
                }
              : undefined
          }
        />
      )}

      {/* Bulk marks [BarnInside.tsx PendingSaleTag] */}
      {Object.entries(pending).map(([dealId, animalId]) => (
        <AnchoredSaleTag key={animalId} animalId={animalId} dealId={dealId} />
      ))}

      {/* [PigpenInside.tsx] what each tradeable Pig pays */}
      {tradeablePigs.map(
        ({ pig, labelled }) =>
          labelled && (
            <AnchoredTradeInLabel
              key={pig.id}
              animalId={pig.id}
              amount={getPigBristles({ game, pig }).amount}
            />
          ),
      )}

      {tradeInMode && (
        <TradeInHud
          eligibleCount={tradeablePigs.length}
          onClose={() => setTradeInMode(false)}
        />
      )}

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
