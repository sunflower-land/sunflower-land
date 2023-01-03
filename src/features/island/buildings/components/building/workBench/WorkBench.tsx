import React from "react";

import npc from "assets/npcs/blacksmith.gif";
import shadow from "assets/npcs/shadow.png";
import workbench from "assets/buildings/workbench.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { WorkbenchModal } from "./components/WorkbenchModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";

export const WorkBench: React.FC<BuildingProps> = ({ isBuilt, onRemove }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      setIsOpen(true);
      return;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <BuildingImageWrapper onClick={handleClick}>
        <img
          src={workbench}
          className="absolute bottom-0"
          style={{
            width: `${PIXEL_SCALE * 47}px`,
            height: `${PIXEL_SCALE * 36}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 14}px`,
            right: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <img
          src={npc}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 16}px`,
            right: `${PIXEL_SCALE * 12}px`,
          }}
        />
      </BuildingImageWrapper>
      <WorkbenchModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
};
