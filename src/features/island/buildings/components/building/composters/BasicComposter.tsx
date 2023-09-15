import React, { useContext, useState } from "react";

import basicComposter from "assets/sfts/aoe/composter_basic.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import {
  CompostingContext,
  MachineInterpreter,
  composterMachine,
  MachineState,
} from "features/island/buildings/lib/composterMachine";
import { hasRequirements } from "features/game/events/landExpansion/startComposter";

const isIdle = (state: MachineState) => state.matches("idle");
const isComposting = (state: MachineState) => state.matches("composting");
const isReady = (state: MachineState) => state.matches("ready");

export const BasicComposter: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showModal, setShowModal] = useState(false);

  const composter = gameState.context.state.buildings["Basic Composter"]?.[0];

  const composterMachineContext: CompostingContext = {
    gameService,
    readyAt: composter && composter.producing?.readyAt,
  };

  const composterService = useInterpret(composterMachine, {
    context: composterMachineContext,
  }) as unknown as MachineInterpreter;

  const idle = useSelector(composterService, isIdle);
  const composting = useSelector(composterService, isComposting);
  const ready = useSelector(composterService, isReady);

  const startComposter = () => {
    composterService.send({
      type: "START_COMPOST",
      event: "composter.started",
      buildingId: composter!.id,
      building: "Basic Composter",
    });
  };

  const handleCollect = () => {
    composterService?.send({
      type: "COLLECT",
      event: "composterProduce.collected",
      buildingId: composter!.id,
      building: "Basic Composter",
    });
  };

  const handleClick = () => {
    if (idle || composting) {
      // composterAudio.play();
      setShowModal(true);
      return;
    }

    if (ready) {
      handleCollect();
      return;
    }
  };

  const canStartComposter =
    hasRequirements(gameState.context.state, "Basic Composter") && !composting;

  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        onClick={handleClick}
      >
        <img
          src={basicComposter}
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            left: `${PIXEL_SCALE * 2}px`,
            bottom: 0,
          }}
          className="absolute"
          alt="Basic Composter"
        />
      </div>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Panel className="z-10">
          {idle && (
            <Button onClick={startComposter} disabled={!canStartComposter}>
              Start Composting
            </Button>
          )}
          {ready && (
            <Button onClick={handleCollect} disabled={!canStartComposter}>
              Collect
            </Button>
          )}
          {composting && <p>Composting...</p>}
        </Panel>
      </Modal>
    </>
  );
};
