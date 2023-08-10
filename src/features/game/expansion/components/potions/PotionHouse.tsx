import React from "react";

import { IntroPage } from "./Intro";
import { Experiment } from "./Experiment";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelRoomBorderStyle } from "features/game/lib/style";
import { Rules } from "./Rules";
import { potionHouseMachine } from "./lib/potionHouseMachine";
import { useActor, useInterpret } from "@xstate/react";

interface Props {
  onClose: () => void;
}

export const PotionHouse: React.FC<Props> = ({ onClose }) => {
  const potionHouseService = useInterpret(potionHouseMachine);
  const [state, send] = useActor(potionHouseService);

  return (
    <Modal show={true} centered onHide={onClose}>
      <div
        className="bg-brown-600 text-white relative"
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
              {true && (
                <img
                  src={SUNNYSIDE.icons.expression_confused}
                  className="cursor-pointer h-full"
                />
              )}
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
