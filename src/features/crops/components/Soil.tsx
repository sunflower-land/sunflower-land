import React, {useContext} from "react";

import plantedSoil from "assets/land/planted.png";
import soil from "assets/land/soil2.png";

import { getTimeLeft } from "lib/utils/time";

import { ProgressBar } from "components/ui/ProgressBar";
import { FieldItem } from "features/game/GameProvider";
import {AppIconContext} from '../AppIconProvider';

import { CROPS } from "../lib/crops";

interface Props {
  field: FieldItem;
}

export const Soil: React.FC<Props> = ({ field }) => {
  const [_, setTimer] = React.useState<number>(0);
  const [badgeUpdated, setBadgeUpdated] = React.useState<boolean>(false);
  const { incrementHarvestable } = useContext(AppIconContext);

  const setHarvestTime = React.useCallback(() => {
    setTimer((count) => count + 1);
  }, []);

  React.useEffect(() => {
    if (field) {
      setHarvestTime();
      const interval = window.setInterval(setHarvestTime, 1000);
      return () => window.clearInterval(interval);
    }
  }, [field]);

  if (!field.crop) {
    return <img src={soil} className="w-full" />;
  }

  const crop = CROPS[field.crop.name];
  const timeLeft = getTimeLeft(field.crop.plantedAt, crop.harvestSeconds);

  // Seedling
  if (timeLeft > 0) {
    const percentage = 100 - (timeLeft / crop.harvestSeconds) * 100;

    return (
      <div className="relative w-full h-full">
        <img src={crop.images.seedling} className="w-full" />
        <div className="absolute w-full -bottom-10 z-10">
          <ProgressBar percentage={percentage} seconds={timeLeft} />
        </div>
      </div>
    );
  }
  if (timeLeft === 0 && !badgeUpdated) {
    setBadgeUpdated(true);
    incrementHarvestable(1);
  }

  // Ready to harvest
  return <img src={crop.images.ready} className="w-full" />;
};
