import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import {
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  type PatchFruitName,
} from "features/game/types/fruits";
import { PATCH_FRUIT_LIFECYCLE } from "./fruits";
import { ProgressBar } from "components/ui/ProgressBar";
import { TimerPopover } from "../common/TimerPopover";
import { ITEM_DETAILS } from "features/game/types/images";
import type { GameState } from "features/game/types/game";
import { getCurrentBiome } from "../biomes/biomes";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  island: GameState["island"];
  patchFruitName: PatchFruitName;
  timeLeft: number;
  /** Cycle length (s) — progress denominator; defaults to base plant time. */
  totalSeconds?: number;
  /** Current effective grow speed; shows a lightning when > 1. */
  speed?: number;
}

const getFruitImage = (imageSource: string) => {
  return (
    <img
      className="absolute"
      style={{
        bottom: `${PIXEL_SCALE * 9}px`,
        left: `${PIXEL_SCALE * 8}px`,
        width: `${PIXEL_SCALE * 16}px`,
        height: `${PIXEL_SCALE * 26}px`,
      }}
      src={imageSource}
    />
  );
};

export const FruitSeedling: React.FC<Props> = ({
  patchFruitName,
  island,
  timeLeft,
  totalSeconds,
  speed,
}) => {
  const { showTimers } = useContext(Context);
  const [showPopover, setShowPopover] = useState(false);
  const { seed } = PATCH_FRUIT[patchFruitName];
  const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];
  const biome = getCurrentBiome(island);
  const lifecycle = PATCH_FRUIT_LIFECYCLE[biome][patchFruitName];

  const cycleSeconds = totalSeconds ?? plantSeconds;
  const isBoosted = speed !== undefined && speed > 1;
  const growPercentage =
    cycleSeconds > 0 ? 100 - (timeLeft / cycleSeconds) * 100 : 0;
  const isAlmostReady = growPercentage >= 50;
  const isHalfway = growPercentage >= 25 && !isAlmostReady;

  let description: string;

  switch (patchFruitName) {
    case "Banana":
    case "Tomato":
    case "Lemon":
      description = `${patchFruitName} Plant Growing`;
      break;
    case "Blueberry":
      description = "Blueberry Bush Growing";
      break;
    default:
      description = `${patchFruitName} Tree Growing`;
  }
  const lifecycleStage = isAlmostReady
    ? lifecycle.almost
    : isHalfway
      ? lifecycle.halfway
      : lifecycle.seedling;

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
    >
      {/* Seedling */}
      {getFruitImage(lifecycleStage)}

      {/* Active speed boost indicator */}
      {isBoosted && (
        <img
          src={SUNNYSIDE.icons.lightning}
          alt=""
          aria-hidden
          className="absolute z-20 pointer-events-none animate-pulse"
          style={{
            width: `${PIXEL_SCALE * 7}px`,
            top: `${PIXEL_SCALE * 2}px`,
            right: `${PIXEL_SCALE * 2}px`,
          }}
        />
      )}

      {/* Progress bar */}
      {showTimers && (
        <div
          className="absolute"
          style={{
            bottom: `${PIXEL_SCALE * 7}px`,
            left: `${PIXEL_SCALE * 8}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <ProgressBar
            percentage={growPercentage}
            seconds={timeLeft}
            type="progress"
            formatLength="short"
          />
        </div>
      )}

      {/* Timer popover */}
      <div
        className="flex justify-center absolute w-full pointer-events-none"
        style={{
          top: `${PIXEL_SCALE * -16}px`,
        }}
      >
        <TimerPopover
          showPopover={showPopover}
          image={ITEM_DETAILS[patchFruitName].image}
          description={description}
          timeLeft={timeLeft}
          speed={speed}
        />
      </div>
    </div>
  );
};
