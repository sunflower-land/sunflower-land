import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import shadow from "assets/npcs/shadow.png";
import bubbles from "assets/decorations/water_bubbles.png";
import fishSilhoutte from "assets/decorations/fish_silhouette.png";
import { Context } from "features/game/GameProvider";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { FishermanModal } from "./FishermanModal";

const expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;

export const Fisherman: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const { gameService, showTimers } = useContext(Context);

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

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
          bumpkinParts={NPC_WEARABLES["reelin roy"]}
        >
          <FishermanModal />
        </CloseButtonPanel>
      </Modal>
      <MapPlacement
        x={wharfCoords().x}
        y={wharfCoords().y}
        width={2}
        height={2}
      >
        <img
          src={SUNNYSIDE.npcs.fisherman}
          style={{
            width: `${28 * PIXEL_SCALE}px`,
            left: `${0 * PIXEL_SCALE}px`,
            bottom: `${12 * PIXEL_SCALE}px`,
          }}
          className="z-10 absolute cursor-pointer hover:img-highlight"
          onClick={() => setShowModal(true)}
        />
        <img
          src={shadow}
          className="absolute z-0"
          style={{
            width: `${16 * PIXEL_SCALE}px`,
            left: `${0 * PIXEL_SCALE}px`,
            top: `${14 * PIXEL_SCALE}px`,
          }}
        />
        <img
          src={bubbles}
          className="absolute z-0 skew-animation cursor-pointer"
          onClick={() => setShowModal(true)}
          style={{
            width: `${37 * PIXEL_SCALE}px`,
            right: `${-20 * PIXEL_SCALE}px`,
            bottom: `${-20 * PIXEL_SCALE}px`,
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
