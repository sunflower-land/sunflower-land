import React from "react";

import soil from "assets/land/soil2.png";

import { getTimeLeft } from "lib/utils/time";
import { ProgressBar } from "components/ui/ProgressBar";
import { CROPS } from "features/game/types/crops";
import { addNoise } from "lib/images";
import { LIFECYCLE } from "../lib/plant";
import { PlantedCrop } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { PlantTimerPopover } from "features/island/common/PlantTimerPopover";

interface Props {
  showCropDetails: boolean;
  showTimers: boolean;
  isRemoving?: boolean;
  plantedCrop?: PlantedCrop;
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
  showTimers,
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

        {showTimers && (
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
        )}

        <PlantTimerPopover
          image={lifecycle.ready}
          name={plantedCrop.name}
          showPopover={showCropDetails}
          timeLeft={timeLeft}
        />
      </div>
    );
  }

  return getCropImage(lifecycle.ready);
};
