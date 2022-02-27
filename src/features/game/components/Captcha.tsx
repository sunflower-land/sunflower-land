import React, { useContext, useEffect } from "react";

import { Panel } from "components/ui/Panel";
import goblin from "assets/npcs/suspicious_goblin.gif";
import { Modal } from "react-bootstrap";
import { Context } from "../GameProvider";
import { useActor } from "@xstate/react";

/**
 * We programatically display the captcha so expose these IDs
 */
export const CAPTCHA_CONTAINER = `recaptcha-container-${Math.floor(
  Math.random() * 10000
)}`;
export const CAPTCHA_ELEMENT = `recaptcha-element-${Math.floor(
  Math.random() * 10000
)}`;

export const Captcha: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState, send] = useActor(gameService);

  return (
    <div
      id={CAPTCHA_CONTAINER}
      className="fixed w-full h-full z-40 flex items-center justify-center hidden"
    >
      <Modal centered show={gameState.matches("captcha")}>
        <Panel>
          <div className="flex flex-col items-center p-4">
            <img src={goblin} className="w-20 h-20" />
            <span className="text-shadow text-sm text-center">
              Something looks suspicious
            </span>
            <span className="text-shadow text-xs text-center underline mb-4">
              Please verify you are not a goblin.
            </span>
            <div id={CAPTCHA_ELEMENT} />
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
