import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { WorkbenchModal } from "./components/WorkbenchModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import type { BuildingProps } from "../Building";
import { SUNNYSIDE } from "assets/sunnyside";
import { WORKBENCH_VARIANTS } from "features/island/lib/alternateArt";
import shadow from "assets/npcs/shadow.png";
import { useSound } from "lib/utils/hooks/useSound";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { INITIAL_SUPPORTED_PLOTS } from "features/game/events/landExpansion/plant";
import { getKeys } from "lib/object";

// Only nudge towards building a Water Well once the player has more crop plots
// than the no-well limit supports, i.e. one or more plots have become
// infertile. This avoids showing the helper at the very start of the tutorial.
const _needsWell = (state: MachineState) => {
  const { buildings, crops, island } = state.context.state;

  const hasWell =
    buildings["Water Well"]?.some((w) => !!w.coordinates) ?? false;
  if (hasWell) return false;

  const placedPlots = getKeys(crops).filter(
    (id) => crops[id].x !== undefined && crops[id].y !== undefined,
  ).length;

  return placedPlots > INITIAL_SUPPORTED_PLOTS(island.type);
};

const _needsScarecrow = (state: MachineState) =>
  !state.context.state.inventory["Basic Scarecrow"] &&
  (state.context.state.farmActivity?.["Sunflower Planted"] ?? 0) >= 6;

export const WorkBench: React.FC<BuildingProps> = ({ isBuilt, island }) => {
  // TODO: feat/crafting-box - remove this
  const [isOpen, setIsOpen] = useState(false);

  const { gameService } = useContext(Context);

  const { play: shopAudio } = useSound("shop");

  const needsWell = useSelector(gameService, _needsWell);
  const needsScarecrow = useSelector(gameService, _needsScarecrow);
  const showHelper = isBuilt && (needsWell || needsScarecrow);

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

        {showHelper && (
          <img
            className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
            src={SUNNYSIDE.icons.click_icon}
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              right: `${PIXEL_SCALE * -8}px`,
              top: `${PIXEL_SCALE * 20}px`,
            }}
          />
        )}
      </BuildingImageWrapper>
      <WorkbenchModal onClose={handleClose} show={isOpen} />
    </>
  );
};
