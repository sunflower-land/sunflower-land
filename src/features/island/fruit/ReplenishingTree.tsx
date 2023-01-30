import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { getTimeLeft } from "lib/utils/time";
import { PlantedFruit } from "features/game/types/game";
import { ProgressBar } from "components/ui/ProgressBar";
import { TimerPopover } from "../common/TimerPopover";
import { FRUIT, FRUIT_SEEDS, FruitName } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";
import { setImageWidth } from "lib/images";
import { FruitDropAnimator } from "components/animation/FruitDropAnimator";
import { getFruitImage } from "./FruitTree";

const pluralisedNames: Record<FruitName, string> = {
  Orange: "Oranges",
  Blueberry: "Blueberries",
  Apple: "Apples",
};

interface Props {
  plantedFruit: PlantedFruit;
  onClick: () => void;
  playAnimation: boolean;
  /**
   * Handles showing "hover" information on mobile or "error" on click action information
   */
  showOnClickInfo: boolean;
}

export const ReplenishingTree: React.FC<Props> = ({
  plantedFruit,
  onClick,
  playAnimation,
  showOnClickInfo,
}) => {
  const { showTimers } = useContext(Context);
  const [showFruitDetails, setFruitDetails] = useState(false);
  const { harvestedAt, name, amount } = plantedFruit;
  const lifecycle = FRUIT_LIFECYCLE[name];

  const { seed, isBush } = FRUIT()[name];
  const { plantSeconds } = FRUIT_SEEDS()[seed];

  const replenishingTimeLeft = getTimeLeft(harvestedAt, plantSeconds);
  const replenishPercentage = 100 - (replenishingTimeLeft / plantSeconds) * 100;

  return (
    <div
      onMouseEnter={() => setFruitDetails(true)}
      onMouseLeave={() => setFruitDetails(false)}
      className="absolute h-full w-full"
    >
      <FruitDropAnimator
        mainImageProps={{
          src: lifecycle.harvested,
          className: "absolute pointer-events-none",
          style: {
            bottom: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * (isBush ? 4 : 3)}px`,
          },
          onLoad: (e) => setImageWidth(e.currentTarget),
          onClick: onClick,
        }}
        dropImageProps={{
          src: getFruitImage(name),
        }}
        dropCount={amount}
        playDropAnimation={playAnimation}
        playShakeAnimation={playAnimation}
      />
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
            percentage={replenishPercentage}
            seconds={replenishingTimeLeft}
            type="progress"
            formatLength="short"
          />
        </div>
      )}

      <TimerPopover
        showPopover={showFruitDetails || showOnClickInfo}
        image={lifecycle.ready}
        name={`${pluralisedNames[name]} Replenishing`}
        timeLeft={replenishingTimeLeft}
        position={{ top: 6, left: 30 }}
      />
    </div>
  );
};
