import React, { useEffect } from "react";

import { Panel } from "components/ui/Panel";
import goblin from "assets/npcs/suspicious_goblin.gif";
import { Modal } from "react-bootstrap";
import { solveCaptcha } from "../actions/autosave";

/**
 * We programatically display the captcha so expose these IDs
 */
export const CAPTCHA_CONTAINER = `recaptcha-container-${Math.floor(
  Math.random() * 10000
)}`;
export const CAPTCHA_ELEMENT = `recaptcha-element-${Math.floor(
  Math.random() * 10000
)}`;

interface Props {
  onSolved: (token: string) => void;
}
export const CaptchaModal: React.FC<Props> = ({ onSolved }) => {
  useEffect(() => {
    const load = async () => {
      // const captcha = await solveCaptcha();
      //onSolved(captcha);

      await new Promise((res) => setTimeout(res, 1000));
      onSolved("123");
    };

    load();
  }, []);

  return (
    <div
      id={CAPTCHA_CONTAINER}
      className="fixed w-full h-full z-40 flex items-center justify-center hidden"
    >
      <Modal centered show={true}>
        <Panel>
          <div className="flex flex-col items-center p-4">
            <img src={goblin} className="w-20 h-20" />

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

export const Captcha: React.FC = () => {
  console.log("Rerender");
  return (
    <div
      id={CAPTCHA_CONTAINER}
      className="w-full h-40 border-red-500 border-2 z-40 flex items-center justify-center"
    >
      <div id={CAPTCHA_ELEMENT} />
    </div>
  );
};
