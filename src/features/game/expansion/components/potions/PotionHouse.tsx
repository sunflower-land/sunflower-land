import React from "react";

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
import { useSelector, useInterpret } from "@xstate/react";
import { useGame } from "features/game/GameProvider";

interface Props {
  onClose: () => void;
}

export const PotionHouse: React.FC<Props> = ({ onClose }) => {
  const { state } = useGame();

  const potionHouse = state.potionHouse;
  const isNewGame = !potionHouse || potionHouse?.game.status === "finished";

  const potionHouseService = useInterpret(potionHouseMachine, {
    context: { isNewGame },
  }) as unknown as PotionHouseMachineInterpreter;

  const isIntroduction = useSelector(potionHouseService, (state) =>
    state.matches("introduction"),
  );
  const isPlaying = useSelector(potionHouseService, (state) =>
    state.matches("playing"),
  );
  const isRules = useSelector(potionHouseService, (state) =>
    state.matches("rules"),
  );

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
              onClick={() => potionHouseService.send("OPEN_RULES")}
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
              {isRules ? "How to play" : "Potion Room"}
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
            {isIntroduction && (
              <IntroPage
                onClose={() => potionHouseService.send("ACKNOWLEDGE")}
              />
            )}
            {isPlaying && (
              <Experiment
                onClose={onClose}
                potionHouseService={potionHouseService}
              />
            )}
            {isRules && (
              <Rules onDone={() => potionHouseService.send("ACKNOWLEDGE")} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
