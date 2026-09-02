import React, {
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useSelector } from "@xstate/react";

import shopDisc from "assets/icons/shop_disc.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { PIXEL_SCALE } from "features/game/lib/constants";
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
import { FeederMachine } from "features/feederMachine/FeederMachine";
import { FeedAllButton } from "features/game/expansion/components/animals/FeedAllButton";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import { getValues } from "lib/object";
import type { GameBridge } from "../bridge/GameBridge";
import { useWorldAnchor } from "../bridge/useWorldAnchor";

/**
 * Animal-house chrome that stays React [barn/BarnInside.tsx +
 * henHouse/HenHouseInside.tsx]: the feeder machine, Feed All, the shop and
 * upgrade discs with their modals, and the bounty-exchange (deal) flow. All
 * are anchored to the room rect published by InteriorUI so they track the
 * camera; the animals themselves are Phaser.
 *
 * The deal handshake runs through `bridge.animalDeal`: the sell tab sets the
 * deal, the renderer dims invalid animals and reports the clicked animal via
 * `selectedId`, and this component shows the AnimalDeal modal for it.
 */

const ROOM_ANCHOR = "interior-room";

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

  const rect = useWorldAnchor(ROOM_ANCHOR);

  const level = Math.min(buildingState.level, 3);
  const nextLevel = Math.min(level + 1, 3);

  return (
    <>
      {rect?.visible && !deal && (
        <>
          {/* Feeder machine, top-centre of the room [BarnInside.tsx] */}
          <div
            className="absolute pointer-events-auto"
            style={{
              left: `${rect.left + rect.width / 2}px`,
              top: `${rect.top - 4 * PIXEL_SCALE}px`,
              transform: "translateX(-50%)",
            }}
          >
            <FeederMachine building={buildingName} />
          </div>
          <div
            className="absolute pointer-events-auto"
            style={{
              left: `${rect.left + rect.width / 2 + 58}px`,
              top: `${rect.top - 11}px`,
            }}
          >
            <FeedAllButton building={buildingName} />
          </div>

          {/* Shop + upgrade discs pinned to the room's top corners */}
          <img
            src={shopDisc}
            alt="Buy Animals"
            className="absolute cursor-pointer pointer-events-auto"
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              left: `${rect.left + rect.width - 18 - PIXEL_SCALE * 18}px`,
              top: `${rect.top + 18}px`,
            }}
            onClick={() => setShowShop(true)}
          />
          <img
            src={SUNNYSIDE.icons.upgrade_disc}
            alt="Upgrade Building"
            className="absolute cursor-pointer pointer-events-auto"
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              left: `${rect.left + 18}px`,
              top: `${rect.top + 18}px`,
            }}
            onClick={() => setShowUpgrade(true)}
          />
        </>
      )}

      <Modal show={showShop} onHide={() => setShowShop(false)}>
        <AnimalBuildingModal
          buildingName={buildingName}
          onClose={() => setShowShop(false)}
          onExchanging={(bounty) => {
            setShowShop(false);
            bridge.animalDeal.set({ deal: bounty });
          }}
        />
      </Modal>

      <UpgradeBuildingModal
        buildingName={buildingName}
        currentLevel={level}
        nextLevel={nextLevel}
        show={showUpgrade}
        onClose={() => setShowUpgrade(false)}
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
