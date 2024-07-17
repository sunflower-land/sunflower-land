import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ProgressBar } from "components/ui/ProgressBar";
import { TimerPopover } from "../common/TimerPopover";
import { FRUIT, FRUIT_SEEDS, FruitName } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";
import classNames from "classnames";
import { ITEM_DETAILS } from "features/game/types/images";

const pluralisedNames: Record<FruitName, string> = {
  Orange: "Oranges",
  Blueberry: "Blueberries",
  Apple: "Apples",
  Banana: "Bananas",
  Tomato: "Tomatoes",
  Lemon: "Lemons",
};

interface Props {
  fruitName: FruitName;
  timeLeft: number;
  playShakeAnimation: boolean;
}

export const ReplenishingTree: React.FC<Props> = ({
  fruitName,
  timeLeft,
  playShakeAnimation,
}) => {
  const { showTimers } = useContext(Context);
  const [showPopover, setShowPopover] = useState(false);
  const lifecycle = FRUIT_LIFECYCLE[fruitName];

  const { seed, isBush } = FRUIT()[fruitName];
  let bottom, left, width;
  switch (fruitName) {
    case "Banana":
      bottom = 8;
      left = 1.2;
      width = 31;
      break;
    case "Lemon":
      bottom = 11;
      left = 10.5;
      width = 9;
      break;
    case "Tomato":
      bottom = 8;
      left = 9.5;
      width = 11;
      break;
    default:
      bottom = 5;
      left = isBush ? 4 : 3;
      width = isBush ? 24 : 26;
  }

  const { plantSeconds } = FRUIT_SEEDS()[seed];

  const replenishPercentage = 100 - (timeLeft / plantSeconds) * 100;

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
          image={ITEM_DETAILS[fruitName].image}
          description={`${pluralisedNames[fruitName]} Replenishing`}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  );
};
