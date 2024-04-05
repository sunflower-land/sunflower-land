import { useSelector } from "@xstate/react";
import bubbles from "assets/decorations/water_bubbles.png";
import fishSilhoutte from "assets/decorations/fish_silhouette.png";
import { Context } from "features/game/GameProvider";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import { FishermanModal } from "./FishermanModal";
import { FishermanNPC } from "./FishermanNPC";
import { InventoryItemName } from "features/game/types/game";
import { FishingBait } from "features/game/types/fishing";
import classNames from "classnames";

const expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;

const _isVisiting = (state: MachineState) => state.matches("visiting");

export const Fisherman: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);

  const expansionCount = useSelector(gameService, expansions);
  const isVisiting = useSelector(gameService, _isVisiting);

  const wharfCoords = () => {
    if (expansionCount < 7) {
      return { x: -1, y: -3 };
    }
    if (expansionCount >= 7 && expansionCount < 21) {
      return { x: -8, y: -9 };
    } else {
      return { x: -14, y: -15 };
    }
  };

  const cast = (bait: FishingBait, chum?: InventoryItemName) => {
    gameService.send("rod.casted", {
      bait,
      chum,
      location: "wharf",
    });
    gameService.send("SAVE");
    setShowModal(false);
  };

  return (
    <>
      <div className={classNames({ "pointer-events-none": isVisiting })}>
        <MapPlacement
          x={wharfCoords().x}
          y={wharfCoords().y}
          width={3}
          height={3}
        >
          <FishermanNPC onClick={() => setShowModal(true)} />

          <img
            src={bubbles}
            className="absolute z-0 skew-animation pointer-events-none"
            style={{
              width: `${37 * PIXEL_SCALE}px`,
              right: `${-6 * PIXEL_SCALE}px`,
              bottom: `${-7 * PIXEL_SCALE}px`,
            }}
          />
          <img
            src={fishSilhoutte}
            className="absolute z-0 fish-swimming pointer-events-none"
            style={{
              width: `${11 * PIXEL_SCALE}px`,
              right: `${0 * PIXEL_SCALE}px`,
              bottom: `${-20 * PIXEL_SCALE}px`,
            }}
          />
        </MapPlacement>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <FishermanModal onCast={cast} onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};
