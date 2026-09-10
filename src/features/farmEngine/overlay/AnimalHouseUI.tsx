import React, {
  useContext,
  useMemo,
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
import { FeederMachineModal } from "features/feederMachine/FeederMachineModal";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import { getValues } from "lib/object";
import type { GameBridge } from "../bridge/GameBridge";

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
 * The deal handshake runs through `bridge.animalDeal`: the sell tab sets the
 * deal, the renderer dims invalid animals and reports the clicked animal via
 * `selectedId`, and this component shows the AnimalDeal modal for it.
 */

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

      {/* Deal mode [BarnInside.tsx]: modal for the clicked animal + HUD */}
      <Modal
        show={!!dealState?.selectedId && !!deal}
        onHide={() =>
          bridge.animalDeal.set(dealState ? { deal: dealState.deal } : null)
        }
      >
        <AnimalDeal
          deal={deal}
          animalId={dealState?.selectedId}
          onClose={() =>
            bridge.animalDeal.set(dealState ? { deal: dealState.deal } : null)
          }
          onSold={() => bridge.animalDeal.set(null)}
        />
      </Modal>

      {deal && (
        <ExchangeHud
          deal={deal}
          onClose={() => bridge.animalDeal.set(null)}
          validAnimalsCount={validAnimalsCount}
        />
      )}
    </>
  );
};
