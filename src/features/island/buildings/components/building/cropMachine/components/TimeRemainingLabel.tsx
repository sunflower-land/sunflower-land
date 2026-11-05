import React from "react";
import type { ProgressProps } from "./PackGrowthProgressBar";
import { secondsToString } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const TimeRemainingLabel = ({
  growsUntil,
  readyAt,
  growTimeRemaining,
  now,
}: ProgressProps) => {
  const { t } = useAppTranslation();

  // ACTUAL time remaining (per the actual-time convention): the wall-clock gap
  // to the (derived, for windowed packs) readyAt while the pack will finish;
  // for a stalled pack, the unfunded work plus whatever funded growth is still
  // ahead of it. For a legacy pack this is arithmetically identical to the old
  // progress-based derivation (work == wall clock at 1×).
  const getTimeRemaining = () => {
    if (readyAt !== undefined) return Math.max(readyAt - now, 0) / 1000;

    if (growsUntil !== undefined) {
      return (growTimeRemaining + Math.max(growsUntil - now, 0)) / 1000;
    }

    return growTimeRemaining / 1000;
  };

  const seconds = Math.max(getTimeRemaining(), 0);
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
