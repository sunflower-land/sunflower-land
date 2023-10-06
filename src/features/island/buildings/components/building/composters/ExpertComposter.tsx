import React, { useContext, useState } from "react";

import expertComposter from "assets/composters/composter_expert.png";
import expertComposterClosed from "assets/composters/composter_expert_closed.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import {
  CompostingContext,
  MachineInterpreter,
  composterMachine,
  MachineState,
} from "features/island/buildings/lib/composterMachine";
import { ComposterModal } from "./ComposterModal";
import { SUNNYSIDE } from "assets/sunnyside";

const isIdle = (state: MachineState) => state.matches("idle");
const isComposting = (state: MachineState) => state.matches("composting");
const isReady = (state: MachineState) => state.matches("ready");

export const ExpertComposter: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showModal, setShowModal] = useState(false);

  const composter = gameState.context.state.buildings["Expert Composter"]?.[0];

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

  const [
    {
      context: { secondsTillReady },
    },
  ] = useActor(composterService);

  const startComposter = () => {
    composterService.send({
      type: "START_COMPOST",
      event: "composter.started",
      buildingId: composter!.id,
      building: "Expert Composter",
    });
  };

  const handleCollect = () => {
    composterService?.send({
      type: "COLLECT",
      event: "compost.collected",
      buildingId: composter!.id,
      building: "Expert Composter",
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

  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 34}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -1}px`,
        }}
        onClick={handleClick}
      >
        <img
          src={idle ? expertComposter : expertComposterClosed}
          style={{
            width: `${PIXEL_SCALE * 34}px`,
            bottom: 0,
          }}
          className="absolute"
          alt="Expert Composter"
        />
      </div>
      <ComposterModal
        {...{
          gameState: gameState.context.state,
          composting,
          idle,
          composterName: "Expert Composter",
          ready,
          showModal,
          secondsTillReady: secondsTillReady ?? 0,
          setShowModal,
          startComposter,
          inventory: gameState.context.state.inventory,
        }}
      />
      {ready && (
        <div
          className="flex justify-center absolute w-full pointer-events-none z-30"
          style={{
            top: `${PIXEL_SCALE * -12}px`,
          }}
        >
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="ready"
            style={{
              width: `${PIXEL_SCALE * 4}px`,
            }}
          />
        </div>
      )}
    </>
  );
};
