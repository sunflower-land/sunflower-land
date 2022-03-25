import React, { useState } from "react";

import classNames from "classnames";
import soil from "assets/land/soil2.png";

import { getTimeLeft, secondsToLongString } from "lib/utils/time";

import { ProgressBar } from "components/ui/ProgressBar";
import { InnerPanel, Panel } from "components/ui/Panel";

import { FieldItem } from "features/game/types/game";
import { CROPS } from "features/game/types/crops";
import { LIFECYCLE } from "../lib/plant";
import classnames from "classnames";

interface Props {
  field?: FieldItem;
  className?: string;
}

export const Soil: React.FC<Props> = ({ field, className }) => {
  const [_, setTimer] = React.useState<number>(0);
  const setHarvestTime = React.useCallback(() => {
    setTimer((count) => count + 1);
  }, []);
  const [showCropDetails, setShowCropDetails] = useState(false);

  React.useEffect(() => {
    if (field) {
      setHarvestTime();
      const interval = window.setInterval(setHarvestTime, 1000);
      return () => window.clearInterval(interval);
    }
  }, [field]);

  if (!field) {
    return <img src={soil} className={classnames("w-full", className)} />;
  }

  const crop = CROPS()[field.name];
  const lifecycle = LIFECYCLE[field.name];
  const timeLeft = getTimeLeft(field.plantedAt, crop.harvestSeconds);
  const timeLeftString = secondsToLongString(timeLeft);

  const handleMouseHover = () => {
    setShowCropDetails(true);
  };

  const handleMouseLeave = () => {
    setShowCropDetails(false);
  };

  // Seedling
  if (timeLeft > 0) {
    const percentage = 100 - (timeLeft / crop.harvestSeconds) * 100;

    return (
      <div 
        className="relative w-full h-full"
        onMouseEnter={handleMouseHover}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={lifecycle.seedling}
          className={classnames("w-full", className)}
        />
        <div className="absolute w-full -bottom-4 z-10">
          <ProgressBar percentage={percentage} seconds={timeLeft} />
        </div>
        <InnerPanel
          className={classNames(
            "text-xxs text-white text-shadow ml-10 transition-opacity absolute whitespace-nowrap sm:opacity-0 bottom-1 w-fit left-1 z-20 pointer-events-none",
            {
              "opacity-100": showCropDetails,
              "opacity-0": !showCropDetails,
            }
          )}
        >
          {field.name} <br />
          {timeLeftString}
        </InnerPanel>
      </div>
    );
  }

  // Ready to harvest
  return (
    <img src={lifecycle.ready} className={classnames("w-full", className)} />
  );
};
