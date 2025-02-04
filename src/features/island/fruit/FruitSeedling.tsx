import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import {
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  PatchFruitName,
} from "features/game/types/fruits";
import { PATCH_FRUIT_LIFECYCLE } from "./fruits";
import { ProgressBar } from "components/ui/ProgressBar";
import { TimerPopover } from "../common/TimerPopover";
import { ITEM_DETAILS } from "features/game/types/images";
import { IslandType } from "features/game/types/game";

interface Props {
  islandType: IslandType;
  patchFruitName: PatchFruitName;
  timeLeft: number;
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
  islandType,
  timeLeft,
}) => {
  const { showTimers } = useContext(Context);
  const [showPopover, setShowPopover] = useState(false);
  const { seed } = PATCH_FRUIT[patchFruitName];
  const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];
  const lifecycle = PATCH_FRUIT_LIFECYCLE[islandType][patchFruitName];

  const growPercentage = 100 - (timeLeft / plantSeconds) * 100;
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
        />
      </div>
    </div>
  );
};
