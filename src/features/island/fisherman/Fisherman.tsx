import { useActor, useInterpret, useSelector } from "@xstate/react";
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
import { FishermanNPC } from "./FishermanNPC";
import { FishingService, fishingMachine } from "./fishingMachines";
import { Button } from "components/ui/Button";

const expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;

export const Fisherman: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService, showTimers } = useContext(Context);

  const fishingService = useInterpret(fishingMachine, {
    context: {},
  }) as unknown as FishingService;

  const [fishingState] = useActor(fishingService);

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

  const cast = () => {
    fishingService.send("CAST");
    setShowModal(false);
  };

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
          bumpkinParts={NPC_WEARABLES["reelin roy"]}
        >
          <FishermanModal onCast={cast} />
        </CloseButtonPanel>
      </Modal>
      <Modal
        centered
        show={fishingState.matches("caught")}
        onHide={() => fishingService.send("CLAIMED")}
      >
        <CloseButtonPanel
          onClose={() => fishingService.send("CLAIMED")}
          bumpkinParts={NPC_WEARABLES["reelin roy"]}
        >
          <p>Congrats</p>
          <Button onClick={() => fishingService.send("CLAIMED")}>Ok</Button>
        </CloseButtonPanel>
      </Modal>
      <MapPlacement
        x={wharfCoords().x}
        y={wharfCoords().y}
        width={3}
        height={3}
      >
        <FishermanNPC
          onClick={() => setShowModal(true)}
          fishingService={fishingService}
        />

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
