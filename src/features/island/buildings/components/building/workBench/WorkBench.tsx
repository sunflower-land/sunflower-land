import React from "react";
import workbench from "assets/buildings/workbench.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { WorkbenchModal } from "./components/WorkbenchModal";

import npc from "assets/npcs/blacksmith.gif";
import shadow from "assets/npcs/shadow.png";

export const WorkBench: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <div
      className="absolute bottom-0"
      style={{
        width: `${PIXEL_SCALE * 48}px`,
      }}
    >
      <img
        src={workbench}
        draggable={false}
        style={{
          width: `${PIXEL_SCALE * 48}px`,
        }}
        className="cursor-pointer hover:img-highlight"
        onClick={handleClick}
      />
      <img
        src={shadow}
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 14}px`,
          right: `${PIXEL_SCALE * 11}px`,
        }}
      />
      <img
        src={npc}
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          bottom: `${PIXEL_SCALE * 16}px`,
          right: `${PIXEL_SCALE * 12}px`,
        }}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <WorkbenchModal onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
