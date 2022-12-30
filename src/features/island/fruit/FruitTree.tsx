import React, { useState } from "react";

import classNames from "classnames";

import { getTimeLeft, secondsToString } from "lib/utils/time";
import { ProgressBar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import { addNoise } from "lib/images";
import { PlantedFruit } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { FRUIT, FruitName } from "features/game/types/fruits";
import { FruitLifecycle, FRUIT_LIFECYCLE } from "./fruits";
import { Soil } from "./Soil";

import deadTree from "assets/fruit/dead_tree.webp";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { Seedling, getFruitImage } from "./Seedling";

interface Props {
  plantedFruit?: PlantedFruit;
  showFruitDetails?: boolean;
  showTimers: boolean;
  playing: boolean;
  onClick: () => void;
}

const CROP_NOISE_LEVEL = 0.1;

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

export const FruitTree: React.FC<Props> = ({
  plantedFruit,
  showFruitDetails,
  showTimers,
  onClick,
  playing,
}) => {
  const [showSelectBox, setShowSelectBox] = useState(false);
  // const [showFruitDetails, setShowFruitDetails] = useState(false);
  const [isMobile] = useIsMobile();
  useUiRefresher({ active: !!plantedFruit });

  if (!plantedFruit) {
    return <Soil playing={playing} onClick={onClick} />;
  }

  const { harvestSeconds } = FRUIT()[plantedFruit.name];
  const lifecycle = FRUIT_LIFECYCLE[plantedFruit.name];

  const handleMouseHover = () => {
    setShowSelectBox(true);

    // if (!plantedFruit) {
    //   return;
    // }

    // const now = Date.now();
    // const actionTime = fruit.harvestedAt || fruit.plantedAt;
    // const isReady = isReadyToHarvest(now, actionTime, FRUIT()[fruit.name]);
    // const isJustPlanted = now - fruit.plantedAt < 1000;

    // // show details if field is NOT ready and NOT just planted
    // if (!isReady && !isJustPlanted) {
    //   // set state to show details
    //   setShowFruitDetails(true);
    // }
  };

  const handleMouseLeave = () => {
    // set state to hide details
    // setShowFruitDetails(false);
    setShowSelectBox(false);
  };

  if (!plantedFruit.harvestsLeft) {
    return (
      <img
        className="relative cursor-pointer"
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

  // weather the tree is replenishing
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
    return (
      <Seedling
        playing={playing}
        onClick={onClick}
        plantedFruit={plantedFruit}
      />
    );
  }

  return (
    <div className="flex justify-center cursor-pointer h-full w-full">
      {getFruitImage(lifecycle.ready)}
    </div>
  );
};
