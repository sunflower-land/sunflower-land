import React from "react";

import classNames from "classnames";
import soil from "assets/land/soil2.png";

import { getTimeLeft, secondsToString } from "lib/utils/time";

import { ProgressBar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";

import { CROPS } from "features/game/types/crops";
import { addNoise } from "lib/images";

import { LIFECYCLE } from "../lib/plant";
import { PlantedCrop } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

interface Props {
  plantedCrop?: PlantedCrop;
  showCropDetails?: boolean;
  isRemoving?: boolean;
}

const CROP_NOISE_LEVEL = 0.1;

const getCropImage = (imageSource: any): JSX.Element => {
  return (
    <img
      className="absolute"
      src={imageSource}
      onLoad={(e) => addNoise(e.currentTarget, CROP_NOISE_LEVEL)}
      style={{
        top: `${PIXEL_SCALE * -12}px`,
        width: `${PIXEL_SCALE * 16}px`,
      }}
    />
  );
};

export const Soil: React.FC<Props> = ({
  plantedCrop,
  showCropDetails,
  isRemoving,
}) => {
  useUiRefresher({ active: !!plantedCrop });

  if (!plantedCrop) {
    return getCropImage(soil);
  }

  const { harvestSeconds } = CROPS()[plantedCrop.name];
  const lifecycle = LIFECYCLE[plantedCrop.name];
  const timeLeft = getTimeLeft(plantedCrop.plantedAt, harvestSeconds);

  // Seedling
  if (timeLeft > 0) {
    const growPercentage = 100 - (timeLeft / harvestSeconds) * 100;
    const isAlmostReady = growPercentage >= 50;
    const isHalfway = growPercentage >= 25 && !isAlmostReady;

    return (
      <div className="relative w-full h-full">
        {plantedCrop?.fertilisers && (
          <div
            className="absolute z-10"
            style={{
              top: `${PIXEL_SCALE * -6}px`,
              left: `${PIXEL_SCALE * 9}px`,
              width: `${PIXEL_SCALE * 10}px`,
            }}
          >
            {plantedCrop.fertilisers.map(({ name }) => (
              <img
                key={name}
                src={ITEM_DETAILS[name].image}
                onLoad={(e) => addNoise(e.currentTarget, CROP_NOISE_LEVEL)}
                style={{
                  width: `${PIXEL_SCALE * 10}px`,
                }}
              />
            ))}
          </div>
        )}

        {getCropImage(
          isAlmostReady
            ? lifecycle.almost
            : isHalfway
            ? lifecycle.halfway
            : lifecycle.seedling
        )}

        <div
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 9}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <ProgressBar
            percentage={isRemoving ? 50 : growPercentage}
            seconds={timeLeft}
            type={isRemoving ? "error" : "progress"}
            formatLength="short"
          />
        </div>

        <InnerPanel
          className={classNames(
            "ml-10 transition-opacity absolute whitespace-nowrap sm:opacity-0 bottom-5 w-fit left-1 z-50 pointer-events-none",
            {
              "opacity-100": showCropDetails,
              "opacity-0": !showCropDetails,
            }
          )}
        >
          <div className="flex flex-col text-xxs text-white text-shadow ml-2 mr-2">
            <div className="flex flex-1 items-center justify-center">
              <img src={lifecycle.ready} className="w-4 mr-1" />
              <span>{plantedCrop.name}</span>
            </div>
            <span className="flex-1">
              {secondsToString(timeLeft, { length: "medium" })}
            </span>
          </div>
        </InnerPanel>
      </div>
    );
  }

  return getCropImage(lifecycle.ready);
};
