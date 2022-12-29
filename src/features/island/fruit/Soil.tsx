import React from "react";

import classNames from "classnames";
import soil from "assets/land/soil2.png";

import { getTimeLeft, secondsToString } from "lib/utils/time";

import { ProgressBar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import { addNoise } from "lib/images";
import { PlantedFruit } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { FRUIT, FruitName } from "features/game/types/fruits";
import { FruitLifecycle, FRUIT_LIFECYCLE } from "./fruits";
import deadTree from "assets/fruit/dead_tree.webp";

interface Props {
  plantedFruit?: PlantedFruit;
  showFruitDetails?: boolean;
  showTimers: boolean;
}

const CROP_NOISE_LEVEL = 0.1;

const getFruitImage = (imageSource: any): JSX.Element => {
  return (
    <img
      className="relative"
      style={{
        bottom: "19px",
        zIndex: "1",
      }}
      src={imageSource}
      onLoad={(e) => addNoise(e.currentTarget, CROP_NOISE_LEVEL)}
    />
  );
};

const Timer = ({
  percentage,
  seconds,
}: {
  percentage: number;
  seconds: number | undefined;
}) => {
  return (
    <div
      className="absolute"
      style={{
        top: `${PIXEL_SCALE * 24.2}px`,
        width: `${PIXEL_SCALE * 15}px`,
      }}
    >
      <ProgressBar
        percentage={percentage}
        seconds={seconds}
        type={"progress"}
        formatLength="short"
      />
    </div>
  );
};

const Popover = ({
  showFruitDetails,
  lifecycle,
  plantedFruitName,
  timeLeft,
}: {
  showFruitDetails: boolean | undefined;
  lifecycle: FruitLifecycle;
  plantedFruitName: FruitName;
  timeLeft: number;
}) => {
  return (
    <InnerPanel
      className={classNames(
        "ml-10 transition-opacity absolute whitespace-nowrap sm:opacity-0 -bottom-2 w-fit left-1 z-50 pointer-events-none",
        {
          "opacity-100": showFruitDetails,
          "opacity-0": !showFruitDetails,
        }
      )}
    >
      <div className="flex flex-col text-xxs text-white text-shadow ml-2 mr-2">
        <div className="flex flex-1 items-center justify-center">
          <img src={lifecycle.ready} className="w-4 mr-1" />
          <span>{plantedFruitName}</span>
        </div>
        <span className="flex-1">
          {secondsToString(timeLeft, { length: "medium" })}
        </span>
      </div>
    </InnerPanel>
  );
};

export const Soil: React.FC<Props> = ({
  plantedFruit,
  showFruitDetails,
  showTimers,
}) => {
  useUiRefresher({ active: !!plantedFruit });

  if (!plantedFruit) {
    return getFruitImage(soil);
  }

  const { harvestSeconds } = FRUIT()[plantedFruit.name];
  const lifecycle = FRUIT_LIFECYCLE[plantedFruit.name];

  if (!plantedFruit.harvestsLeft) {
    return (
      <img
        className="relative"
        style={{
          bottom: "10px",
          zIndex: "1",
          height: `${PIXEL_SCALE * 25}px`,
        }}
        src={deadTree}
        onLoad={(e) => addNoise(e.currentTarget, CROP_NOISE_LEVEL)}
      />
    );
  }

  // weather the tree is replinishing
  if (plantedFruit.harvestedAt) {
    const replenishingTimeLeft = getTimeLeft(
      plantedFruit.harvestedAt,
      harvestSeconds
    );
    if (replenishingTimeLeft > 0) {
      const replenishPercentage =
        100 - (replenishingTimeLeft / harvestSeconds) * 100;
      return (
        <div className="relative w-full h-full flex justify-center">
          {getFruitImage(lifecycle.harvested)}
          {showTimers && (
            <Timer
              percentage={replenishPercentage}
              seconds={replenishingTimeLeft}
            />
          )}
          <Popover
            showFruitDetails={showFruitDetails}
            lifecycle={lifecycle}
            plantedFruitName={plantedFruit.name}
            timeLeft={replenishingTimeLeft}
          />
        </div>
      );
    }
  }

  // Seedling
  const growingTimeLeft = getTimeLeft(plantedFruit.plantedAt, harvestSeconds);
  if (growingTimeLeft > 0) {
    const growPercentage = 100 - (growingTimeLeft / harvestSeconds) * 100;
    const isAlmostReady = growPercentage >= 50;
    const isHalfway = growPercentage >= 25 && !isAlmostReady;

    return (
      <div className="relative w-full h-full flex justify-center">
        {getFruitImage(
          isAlmostReady
            ? lifecycle.almost
            : isHalfway
            ? lifecycle.halfway
            : lifecycle.seedling
        )}

        {showTimers && (
          <Timer percentage={growPercentage} seconds={growingTimeLeft} />
        )}

        <Popover
          showFruitDetails={showFruitDetails}
          lifecycle={lifecycle}
          plantedFruitName={plantedFruit.name}
          timeLeft={growingTimeLeft}
        />
      </div>
    );
  }

  return getFruitImage(lifecycle.ready);
};
