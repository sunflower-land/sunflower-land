import React, { useEffect, useState } from "react";
import { calculateCropProgress } from "../lib/calculateCropProgress";
import { ProgressProps } from "./PackGrowthProgressBar";
import { secondsToString } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const TimeRemainingLabel = ({
  startTime,
  paused,
  growsUntil,
  totalGrowTime,
  readyAt,
  growTimeRemaining,
}: ProgressProps) => {
  const { t } = useAppTranslation();

  const getTimeRemaining = () => {
    const progress = calculateCropProgress({
      startTime,
      totalGrowTime,
      readyAt,
      growsUntil,
      growTimeRemaining,
    });
    const elapsedGrowTime = (totalGrowTime * progress) / 100;
    const remainingGrowTime = totalGrowTime - elapsedGrowTime;

    return remainingGrowTime / 1000;
  };

  const [secondsRemaining, setSecondsRemaining] = useState(getTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        setSecondsRemaining(getTimeRemaining());
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, startTime, totalGrowTime]);

  const seconds = Math.max(secondsRemaining, 0);
  const time = secondsToString(seconds, {
    length: "medium",
    isShortFormat: true,
    removeTrailingZeros: true,
  });

  return (
    <Label type="info" icon={SUNNYSIDE.icons.stopwatch} className="capitalize">
      {t("cropMachine.growTimeRemaining", { time })}
    </Label>
  );
};
