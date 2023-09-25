import React, { useContext, useState } from "react";

import advancedComposter from "assets/composters/composter_advanced.png";
import advancedComposterClosed from "assets/composters/composter_advanced_closed.png";
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

export const AdvancedComposter: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showModal, setShowModal] = useState(false);

  const composter =
    gameState.context.state.buildings["Advanced Composter"]?.[0];

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
      building: "Advanced Composter",
    });
  };

  const handleCollect = () => {
    composterService?.send({
      type: "COLLECT",
      event: "compost.collected",
      buildingId: composter!.id,
      building: "Advanced Composter",
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
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 27}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        onClick={handleClick}
      >
        <img
          src={idle ? advancedComposter : advancedComposterClosed}
          style={{
            width: `${PIXEL_SCALE * 27}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Advanced Composter"
        />
      </div>
      <ComposterModal
        {...{
          gameState: gameState.context.state,
          composting,
          idle,
          composterName: "Advanced Composter",
          ready,
          showModal,
          secondsTillReady: secondsTillReady ?? 0,
          setShowModal,
          startComposter,
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
