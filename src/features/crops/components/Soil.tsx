import React, { useContext } from "react";

import soil from "assets/land/soil2.png";

import { getTimeLeft } from "lib/utils/time";

import { ProgressBar } from "components/ui/ProgressBar";

import { FieldItem } from "features/game/types/game";
import { AppIconContext } from "features/crops/AppIconProvider";
import { CROPS } from "features/game/types/crops";
import { LIFECYCLE } from "../lib/plant";
import classnames from "classnames";

interface Props {
  field?: FieldItem;
  className?: string;
}

export const Soil: React.FC<Props> = ({ field, className }) => {
  const [_, setTimer] = React.useState<number>(0);
  const [badgeUpdated, setBadgeUpdated] = React.useState<boolean>(false);
  const { updateHarvestable } = useContext(AppIconContext);
  const setHarvestTime = React.useCallback(() => {
    setTimer((count) => count + 1);
  }, []);

  React.useEffect(() => {
    if (field) {
      setHarvestTime();
      const interval = window.setInterval(setHarvestTime, 1000);
      return () => {
        window.clearInterval(interval);
        setBadgeUpdated(false); // prevent crop+seed bug
      };
    }
  }, [field]);

  React.useEffect(() => {
    if (badgeUpdated) updateHarvestable("plus");
  }, [badgeUpdated]);

  if (!field) {
    return <img src={soil} className={classnames("w-full", className)} />;
  }

  const crop = CROPS()[field.name];
  const lifecycle = LIFECYCLE[field.name];
  const timeLeft = getTimeLeft(field.plantedAt, crop.harvestSeconds);

  // Seedling
  if (timeLeft > 0) {
    const percentage = 100 - (timeLeft / crop.harvestSeconds) * 100;

    return (
      <div className={"relative w-full h-full"}>
        <img
          src={lifecycle.seedling}
          className={classnames("w-full", className)}
        />
        <div className="absolute w-full -bottom-4 z-10">
          <ProgressBar percentage={percentage} seconds={timeLeft} />
        </div>
      </div>
    );
  }
  if (timeLeft === 0 && !badgeUpdated) {
    setBadgeUpdated(true);
  }
  // Ready to harvest
  return (
    <img src={lifecycle.ready} className={classnames("w-full", className)} />
  );
};
