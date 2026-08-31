import React, { useState } from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { TimerPopover } from "features/island/common/TimerPopover";
import type { GameState, TemperateSeasonName } from "features/game/types/game";
import type { TreeName } from "features/game/types/resources";
import { STUMP_VARIANTS } from "features/island/lib/alternateArt";
import {
  getCurrentBiome,
  type LandBiomeName,
} from "features/island/biomes/biomes";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  timeLeft: number;
  island: GameState["island"];
  season: TemperateSeasonName;
  /** The recovering tree — names it in the popover, as a plot names its crop. */
  name: TreeName;
}

const DepletedTreeComponent: React.FC<Props> = ({
  timeLeft,
  island,
  season,
  name,
}) => {
  const [showTimeLeft, setShowTimeLeft] = useState(false);

  const biome: LandBiomeName = getCurrentBiome(island);

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <div className="absolute w-full h-full pointer-events-none">
        <img
          src={STUMP_VARIANTS[biome][season]}
          className="absolute opacity-50"
          style={{
            width: `${GRID_WIDTH_PX}px`,
            bottom: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 8}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full"
          style={{
            top: `${PIXEL_SCALE * -10}px`,
          }}
        >
          <TimerPopover
            image={SUNNYSIDE.resource.tree}
            description={name}
            showPopover={showTimeLeft}
            timeLeft={timeLeft}
          />
        </div>
      </div>
    </div>
  );
};

export const DepletedTree = React.memo(DepletedTreeComponent);
