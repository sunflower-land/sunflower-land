import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import idle from "assets/npcs/idle.gif";
import questionMark from "assets/icons/expression_confused.png";
import axe from "assets/tools/axe.png";
import close from "assets/icons/close.png";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

export const Lumberjack: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [scrollIntoView] = useScrollIntoView();

  const goToBlacksmith = () => {
    setShowModal(false);
    scrollIntoView(Section.Town);
  };

  return (
    <>
      <img
        src={questionMark}
        className="absolute z-10 animate-float"
        style={{
          width: `${GRID_WIDTH_PX * 0.3}px`,
          right: `${GRID_WIDTH_PX * 5}px`,

          top: `${GRID_WIDTH_PX * 2.8}px`,
        }}
      />
      <img
        src={idle}
        onClick={() => setShowModal(true)}
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${GRID_WIDTH_PX * 0.75}px`,
          right: `${GRID_WIDTH_PX * 4.8}px`,
          top: `${GRID_WIDTH_PX * 3.45}px`,
        }}
      />

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            onClick={() => setShowModal(false)}
          />
          <div className="flex items-start">
            <img src={axe} className="w-12 img-highlight mr-2" />
            <div className="flex-1">
              <span className="text-shadow mr-4 block">
                Something looks different about these trees...
              </span>
              <span className="text-shadow block mt-4">
                I wonder if I can craft something to chop them down?
              </span>
              <Button className="text-sm" onClick={goToBlacksmith}>
                Go to the Blacksmith
              </Button>
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
