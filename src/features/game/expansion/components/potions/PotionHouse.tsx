import React, { useContext } from "react";

import { IntroPage } from "./Intro";
import { Experiment } from "./Experiment";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelRoomBorderStyle } from "features/game/lib/style";
import { Rules } from "./Rules";
import {
  PotionHouseMachineInterpreter,
  potionHouseMachine,
} from "./lib/potionHouseMachine";
import { useActor, useInterpret } from "@xstate/react";
import { Context } from "features/game/GameProvider";

interface Props {
  onClose: () => void;
}

export const PotionHouse: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);

  const potionHouse = gameService.state.context.state.potionHouse;
  const isNewGame = !potionHouse || potionHouse?.game.status === "finished";

  const potionHouseService = useInterpret(potionHouseMachine, {
    context: { isNewGame },
  }) as unknown as PotionHouseMachineInterpreter;

  const [state, send] = useActor(potionHouseService);

  return (
    <Modal show onHide={onClose}>
      <div
        className="bg-brown-600  relative"
        style={{
          ...pixelRoomBorderStyle,
          padding: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <div id="cover" />
        <div className="p-1 flex relative flex-col h-full overflow-y-auto scrollable">
          {/* Header */}
          <div className="flex mb-3 w-full justify-center">
            <div
              onClick={() => send("OPEN_RULES")}
              style={{
                height: `${PIXEL_SCALE * 11}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            >
              <img
                src={SUNNYSIDE.icons.expression_confused}
                className="cursor-pointer h-full"
              />
            </div>
            <h1 className="grow text-center text-lg">
              {state.matches("rules") ? "How to play" : "Potion Room"}
            </h1>
            <img
              src={SUNNYSIDE.icons.close}
              className="cursor-pointer"
              onClick={onClose}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>
          <div className="flex flex-col grow mb-1">
            {state.matches("introduction") && (
              <IntroPage onClose={() => send("ACKNOWLEDGE")} />
            )}
            {state.matches("playing") && (
              <Experiment
                onClose={onClose}
                potionHouseService={potionHouseService}
              />
            )}
            {state.matches("rules") && (
              <Rules onDone={() => send("ACKNOWLEDGE")} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
