import React, { useState } from "react";

import { CROPS, CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { GrowthStage, Soil } from "features/island/plots/components/Soil";
import { Bar, ProgressBar } from "components/ui/ProgressBar";

import lightning from "assets/icons/lightning.png";
import powerup from "assets/icons/level_up.png";

import { TimerPopover } from "../../common/TimerPopover";
import { getTimeLeft } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import classNames from "classnames";
import { CropFertiliser } from "features/game/types/game";

interface Props {
  cropName?: CropName;
  plantedAt?: number;
  fertiliser?: CropFertiliser;
  procAnimation?: JSX.Element;
  touchCount: number;
  showTimers: boolean;
}

const FertilePlotComponent: React.FC<Props> = ({
  cropName,
  plantedAt,
  fertiliser,
  procAnimation,
  touchCount,
  showTimers,
}) => {
  const [showTimerPopover, setShowTimerPopover] = useState(false);

  const harvestSeconds = cropName ? CROPS()[cropName].harvestSeconds : 0;
  const timeLeft = plantedAt ? getTimeLeft(plantedAt, harvestSeconds) : 0;
  const isGrowing = timeLeft > 0;

  useUiRefresher({ active: isGrowing });

  const growPercentage = 100 - (timeLeft / harvestSeconds) * 100;
  const stage: GrowthStage | undefined = !cropName
    ? undefined
    : growPercentage >= 100
    ? "ready"
    : growPercentage >= 50
    ? "almost"
    : growPercentage >= 25
    ? "halfway"
    : "seedling";

  const handleMouseEnter = () => {
    // show details if field is growing
    if (isGrowing) {
      // set state to show details
      setShowTimerPopover(true);
    }
  };

  const handleMouseLeave = () => {
    // set state to hide details
    setShowTimerPopover(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative"
    >
      <div
        className={classNames("w-full h-full relative", {
          "cursor-pointer hover:img-highlight": !stage || stage === "ready",
        })}
      >
        {/* Crop base image */}
        <div
          className="relative pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        >
          <Soil cropName={cropName} stage={stage} />
        </div>
      </div>

      {/* Fertiliser */}
      {!!fertiliser && (
        <img
          key={fertiliser.name}
          className="absolute z-10 pointer-events-none"
          src={fertiliser.name === "Rapid Root" ? lightning : powerup}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            bottom: `${PIXEL_SCALE * 8}px`,
            right: `${PIXEL_SCALE * -4}px`,
          }}
        />
      )}

      {/* Time popover */}
      {!!cropName && isGrowing && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -18}px`,
          }}
        >
          <TimerPopover
            image={ITEM_DETAILS[cropName].image}
            description={cropName}
            showPopover={showTimerPopover}
            timeLeft={timeLeft}
          />
        </div>
      )}

      {/* Health bar for collecting rewards */}
      {!!touchCount && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * 9}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <Bar percentage={100 - touchCount * 50} type="health" />
        </div>
      )}

      {/* Progres bar for growing crops */}
      {showTimers && timeLeft > 0 && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * 9}px`,
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

      {/* Firework animation */}
      {procAnimation}
    </div>
  );
};

export const FertilePlot = React.memo(FertilePlotComponent);
