import React from "react";

import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { formatReadyAt, secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";

interface Props {
  showPopover: boolean;
  image: string;
  description: string;
  timeLeft: number;
  secondaryImage?: string | undefined;
  secondaryDescription?: string;
  /** Current effective grow speed; shows a lightning + multiplier when > 1. */
  speed?: number;
  /**
   * When the task is actually ready (wall clock). Shown as a "Ready at" line
   * while boosted, so the fast-draining work reading stays anchored to a real
   * clock. Needs `now` for the same-local-day check.
   */
  readyAt?: number;
  now?: number;
}

export const TimerPopover: React.FC<Props> = ({
  showPopover,
  image,
  description,
  timeLeft,
  secondaryImage,
  secondaryDescription,
  speed,
  readyAt,
  now,
}) => {
  const { t } = useAppTranslation();
  const hasSecondRow = secondaryImage != null || secondaryDescription != null;
  const isBoosted = speed !== undefined && speed > 1;

  return (
    <InnerPanel
      className={classNames(
        "transition-opacity absolute w-fit max-w-[220px] z-50 pointer-events-none",
        {
          "opacity-100": showPopover,
          "opacity-0": !showPopover,
        },
      )}
    >
      <div className="flex flex-col text-xs gap-0.5 items-center pl-2 pr-1">
        <div className="flex flex-1 items-center justify-center">
          <img src={image} className="w-4 mr-1" />
          <span className="whitespace-nowrap">{description}</span>
        </div>
        {hasSecondRow && (
          <div className="flex flex-1 items-center justify-center">
            {secondaryImage && (
              <img src={secondaryImage} className="w-4 mr-1" />
            )}
            {secondaryDescription && <span>{secondaryDescription}</span>}
          </div>
        )}
        {isBoosted && (
          <Label
            type="transparent"
            icon={SUNNYSIDE.icons.lightning}
            className="self-center"
          >
            <span className="whitespace-nowrap">
              {t("description.boostedSpeed", {
                speed: Number(speed.toFixed(2)),
              })}
            </span>
          </Label>
        )}
        <span className="flex-1 text-center font-secondary">
          {/* secondsToString joins units with a non-breaking space, which would
              force a long boosted "full" time (e.g. a multi-day flower) onto one
              line and overflow this fixed-width popover. Normalise to a regular
              space so it wraps within the panel. */}
          {secondsToString(timeLeft, {
            length: speed && speed > 1 ? "full" : "medium",
          }).replace(/\u00A0/g, " ")}
        </span>
        {isBoosted && readyAt !== undefined && now !== undefined && (
          <span className="flex-1 text-center text-xxs">
            {t("description.boostedReadyAt", {
              time: formatReadyAt(readyAt, now),
            })}
          </span>
        )}
      </div>
    </InnerPanel>
  );
};
