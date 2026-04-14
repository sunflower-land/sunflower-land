import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { WorkbenchModal } from "./components/WorkbenchModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { SUNNYSIDE } from "assets/sunnyside";
import { WORKBENCH_VARIANTS } from "features/island/lib/alternateArt";
import shadow from "assets/npcs/shadow.png";
import { useSound } from "lib/utils/hooks/useSound";
import { getCurrentBiome } from "features/island/biomes/biomes";

export const WorkBench: React.FC<BuildingProps> = ({ isBuilt, island }) => {
  // TODO: feat/crafting-box - remove this
  const [isOpen, setIsOpen] = useState(false);

  const { play: shopAudio } = useSound("shop");

  const handleClick = () => {
    if (isBuilt) {
      // Add future on click actions here
      shopAudio();
      setIsOpen(true);
      return;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <BuildingImageWrapper name="Workbench" onClick={handleClick}>
        <img
          src={WORKBENCH_VARIANTS[getCurrentBiome(island)]}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 47}px`,
          }}
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
          src={SUNNYSIDE.npcs.blacksmith_npc}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 16}px`,
            right: `${PIXEL_SCALE * 12}px`,
          }}
        />
      </BuildingImageWrapper>
      <WorkbenchModal onClose={handleClose} show={isOpen} />
    </>
  );
};
