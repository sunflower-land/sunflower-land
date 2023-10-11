import React, { useContext, useState } from "react";

import basicComposter from "assets/composters/composter_basic.png";
import basicComposterClosed from "assets/composters/composter_basic_closed.png";
import basicComposterReady from "assets/composters/composter_basic_ready.png";
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
import { ProgressBar } from "components/ui/ProgressBar";

const isIdle = (state: MachineState) => state.matches("idle");
const isComposting = (state: MachineState) => state.matches("composting");
const isReady = (state: MachineState) => state.matches("ready");

export const BasicComposter: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { buildings } = gameState.context.state;
  const [showModal, setShowModal] = useState(false);

  const composter = buildings["Basic Composter"]?.[0];

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
    setShowModal(false);

    // Simulate delayed closing of lid
    setTimeout(() => {
      composterService.send({
        type: "START_COMPOST",
        event: "composter.started",
        buildingId: composter!.id,
        building: "Basic Composter",
      });
    }, 200);
  };

  const handleClick = () => {
    setShowModal(true);
  };

  const handleCollect = () => {
    composterService?.send({
      type: "COLLECT",
      event: "compost.collected",
      buildingId: composter!.id,
      building: "Basic Composter",
    });
  };

  let image = basicComposter;
  if (ready) {
    image = basicComposterReady;
  } else if (composting) {
    image = basicComposterClosed;
  }

  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        onClick={handleClick}
      >
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            left: `${PIXEL_SCALE * 2}px`,
            bottom: 0,
          }}
          className="absolute"
          alt="Basic Composter"
        />
        {composting && composter?.producing?.readyAt && (
          <ProgressBar
            formatLength="short"
            percentage={10}
            seconds={(composter?.producing?.readyAt - Date.now()) / 1000}
            type="progress"
            style={{
              bottom: "24px",
              left: "17px",
            }}
          />
        )}
      </div>
      <ComposterModal
        composterName="Basic Composter"
        showModal={showModal}
        setShowModal={setShowModal}
        startComposter={startComposter}
        readyAt={composter?.producing?.readyAt}
        onCollect={handleCollect}
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
