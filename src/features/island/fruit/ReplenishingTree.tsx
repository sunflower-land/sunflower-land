import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ProgressBar } from "components/ui/ProgressBar";
import { TimerPopover } from "../common/TimerPopover";
import {
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  PatchFruitName,
} from "features/game/types/fruits";
import { PATCH_FRUIT_LIFECYCLE } from "./fruits";
import classNames from "classnames";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState } from "features/game/types/game";
import { getCurrentBiome } from "../biomes/biomes";

const pluralisedNames: Record<PatchFruitName, string> = {
  Orange: "Oranges",
  Blueberry: "Blueberries",
  Apple: "Apples",
  Banana: "Bananas",
  Tomato: "Tomatoes",
  Lemon: "Lemons",
  Celestine: "Celestines",
  Lunara: "Lunara",
  Duskberry: "Duskberries",
};

interface Props {
  patchFruitName: PatchFruitName;
  island: GameState["island"];
  timeLeft: number;
  playShakeAnimation: boolean;
}

export const ReplenishingTree: React.FC<Props> = ({
  island,
  patchFruitName,
  timeLeft,
  playShakeAnimation,
}) => {
  const { showTimers } = useContext(Context);
  const [showPopover, setShowPopover] = useState(false);
  const biome = getCurrentBiome(island);
  const lifecycle = PATCH_FRUIT_LIFECYCLE[biome][patchFruitName];

  const { seed, isBush } = PATCH_FRUIT[patchFruitName];
  let bottom, left, width;
  switch (patchFruitName) {
    case "Banana":
      bottom = 8;
      left = 1.2;
      width = 31;
      break;
    case "Lemon":
      bottom = 10;
      left = 10;
      width = 12;
      break;
    case "Tomato":
      bottom = 10;
      left = 8;
      width = 14;
      break;
    case "Celestine":
    case "Lunara":
    case "Duskberry":
      bottom = 8;
      left = 9;
      width = 15;
      break;
    default:
      bottom = 5;
      left = isBush ? 4 : 3;
      width = isBush ? 24 : 26;
  }

  const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];

  const replenishPercentage =
    plantSeconds > 0 ? 100 - (timeLeft / plantSeconds) * 100 : 0;

  return (
    <div
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
      className="absolute h-full w-full"
    >
      {/* Replenishing tree */}
      <img
        src={lifecycle.harvested}
        className={classNames("absolute pointer-events-none", {
          "resource-node-shake-animation": playShakeAnimation,
        })}
        style={{
          bottom: `${PIXEL_SCALE * bottom}px`,
          left: `${PIXEL_SCALE * left}px`,
          width: `${PIXEL_SCALE * width}px`,
        }}
      />

      {/* Progress bar */}
      {showTimers && (
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 7}px`,
            left: `${PIXEL_SCALE * 8}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <ProgressBar
            percentage={replenishPercentage}
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
          description={`${pluralisedNames[patchFruitName]} Replenishing`}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  );
};
