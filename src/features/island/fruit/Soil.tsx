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
import { FRUIT } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";

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
  const timeLeft = getTimeLeft(plantedFruit.plantedAt, harvestSeconds);

  // Seedling
  if (timeLeft > 0) {
    const growPercentage = 100 - (timeLeft / harvestSeconds) * 100;
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
          <div
            className="absolute"
            style={{
              top: `${PIXEL_SCALE * 18}px`,
              width: `${PIXEL_SCALE * 15}px`,
            }}
          >
            <ProgressBar
              percentage={growPercentage}
              seconds={timeLeft}
              type={"progress"}
              formatLength="short"
            />
          </div>
        )}

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
              <span>{plantedFruit.name}</span>
            </div>
            <span className="flex-1">
              {secondsToString(timeLeft, { length: "medium" })}
            </span>
          </div>
        </InnerPanel>
      </div>
    );
  }

  return getFruitImage(lifecycle.ready);
};
