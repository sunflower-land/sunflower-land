import React, { useEffect, useRef } from "react";

import classNames from "classnames";
import soil from "assets/land/soil2.png";

import { getTimeLeft, secondsToMidString } from "lib/utils/time";

import { ProgressBar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";

import { FieldItem } from "features/game/types/game";
import { CROPS } from "features/game/types/crops";
import { addNoise, RandomID } from "lib/images";

import { LIFECYCLE } from "../lib/plant";
import classnames from "classnames";

interface Props {
  field?: FieldItem;
  className?: string;
  showCropDetails?: boolean;
}

const Ready: React.FC<{ image: string; className: string }> = ({
  image,
  className,
}) => {
  const id = useRef(RandomID());

  useEffect(() => {
    // Randomly add some noise to the crops
    if (Math.random() > 0.8) {
      addNoise(id.current, 0.15);
    }
  }, []);

  return (
    <img
      id={id.current}
      src={image}
      className={classnames("w-full", className)}
    />
  );
};

export const Soil: React.FC<Props> = ({
  field,
  className,
  showCropDetails,
}) => {
  const [_, setTimer] = React.useState<number>(0);
  const setHarvestTime = React.useCallback(() => {
    setTimer((count) => count + 1);
  }, []);

  React.useEffect(() => {
    if (field) {
      setHarvestTime();
      const interval = window.setInterval(setHarvestTime, 1000);
      return () => window.clearInterval(interval);
    }
  }, [field, setHarvestTime]);

  if (!field) {
    return <img src={soil} className={classnames("w-full", className)} />;
  }

  const crop = CROPS()[field.name];
  const lifecycle = LIFECYCLE[field.name];
  const timeLeft = getTimeLeft(field.plantedAt, crop.harvestSeconds);

  // Seedling
  if (timeLeft > 0) {
    const percentage = 100 - (timeLeft / crop.harvestSeconds) * 100;
    const isAlmostReady = percentage >= 50;

    return (
      <div className="relative w-full h-full">
        <img
          src={isAlmostReady ? lifecycle.almost : lifecycle.seedling}
          className={classnames("w-full", className)}
        />
        <div className="absolute w-full -bottom-4 z-10">
          <ProgressBar percentage={percentage} seconds={timeLeft} />
        </div>
        <InnerPanel
          className={classNames(
            "ml-10 transition-opacity absolute whitespace-nowrap sm:opacity-0 bottom-5 w-fit left-1 z-20 pointer-events-none",
            {
              "opacity-100": showCropDetails,
              "opacity-0": !showCropDetails,
            }
          )}
        >
          <div className="flex flex-col text-xxs text-white text-shadow ml-2 mr-2">
            <div className="flex flex-1 items-center justify-center">
              <img src={lifecycle.ready} className="w-4 mr-1" />
              <span>{field.name}</span>
            </div>
            <span className="flex-1">{secondsToMidString(timeLeft)}</span>
          </div>
        </InnerPanel>
      </div>
    );
  }

  return <Ready className={className as string} image={lifecycle.ready} />;
};
