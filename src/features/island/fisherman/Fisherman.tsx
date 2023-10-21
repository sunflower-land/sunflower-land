import { useActor, useSelector } from "@xstate/react";
import bubbles from "assets/decorations/water_bubbles.png";
import fishSilhoutte from "assets/decorations/fish_silhouette.png";
import { Context } from "features/game/GameProvider";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { FishermanModal } from "./FishermanModal";
import { FishermanNPC } from "./FishermanNPC";
import { InventoryItemName } from "features/game/types/game";
import { FishingBait } from "features/game/types/fishing";

const expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;

const caughtFish = (state: MachineState) =>
  state.context.state.fishing.wharf.caught;

export const Fisherman: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService, showTimers } = useContext(Context);

  const [gameState] = useActor(gameService);
  const fishing = gameState.context.state.fishing;

  const expansionCount = useSelector(gameService, expansions);
  const wharfCoords = () => {
    if (expansionCount < 7) {
      return { x: -1, y: -3.5 };
    }
    if (expansionCount >= 7 && expansionCount < 21) {
      return { x: -8, y: -9.5 };
    } else {
      return { x: -15, y: -15.5 };
    }
  };

  const cast = (bait: FishingBait, chum?: InventoryItemName) => {
    gameService.send("rod.casted", { bait, chum });
    gameService.send("SAVE");
    setShowModal(false);
  };

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <FishermanModal onCast={cast} onClose={() => setShowModal(false)} />
      </Modal>

      <MapPlacement
        x={wharfCoords().x}
        y={wharfCoords().y}
        width={3}
        height={3}
      >
        <FishermanNPC onClick={() => setShowModal(true)} />

        <img
          src={bubbles}
          className="absolute z-0 skew-animation cursor-pointer"
          onClick={() => setShowModal(true)}
          style={{
            width: `${37 * PIXEL_SCALE}px`,
            right: `${-6 * PIXEL_SCALE}px`,
            bottom: `${-6 * PIXEL_SCALE}px`,
          }}
        />
        <img
          src={fishSilhoutte}
          className="absolute z-0 fish-swimming"
          style={{
            width: `${11 * PIXEL_SCALE}px`,
            right: `${0 * PIXEL_SCALE}px`,
            bottom: `${-20 * PIXEL_SCALE}px`,
          }}
        />
      </MapPlacement>
    </>
  );
};
