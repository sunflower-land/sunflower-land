import React, { SyntheticEvent } from "react";
import workbench from "assets/buildings/workbench.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { WorkbenchModal } from "./components/WorkbenchModal";

import npc from "assets/npcs/blacksmith.gif";
import shadow from "assets/npcs/shadow.png";
import { ClickableBuildingImage } from "../ClickableBuildingImage";

export const WorkBench: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = (event: SyntheticEvent) => {
    event.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = (event?: SyntheticEvent) => {
    event?.stopPropagation();
    setIsOpen(false);
  };

  return (
    <>
      <ClickableBuildingImage
        style={{
          width: `${PIXEL_SCALE * 48}px`,
          height: `${PIXEL_SCALE * 32}px`,
        }}
        onClick={handleClick}
      >
        <div
          className="absolute bottom-0"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
          }}
        >
          <img
            src={workbench}
            style={{
              width: `${PIXEL_SCALE * 48}px`,
            }}
            className="cursor-pointer hover:img-highlight"
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
        </div>
      </ClickableBuildingImage>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <WorkbenchModal onClose={handleClose} />
      </Modal>
    </>
  );
};
