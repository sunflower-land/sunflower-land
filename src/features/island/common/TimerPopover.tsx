import React from "react";

import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";
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
}

export const TimerPopover: React.FC<Props> = ({
  showPopover,
  image,
  description,
  timeLeft,
  secondaryImage,
  secondaryDescription,
  speed,
}) => {
  const { t } = useAppTranslation();
  const hasSecondRow = secondaryImage != null || secondaryDescription != null;
  const isBoosted = speed !== undefined && speed > 1;

  return (
    <InnerPanel
      className={classNames(
        "transition-opacity absolute max-w-[140px] z-50 pointer-events-none",
        {
          "opacity-100": showPopover,
          "opacity-0": !showPopover,
        },
      )}
    >
      <div className="flex flex-col text-xs mx-2 gap-0.5">
        <div className="flex flex-1 items-center justify-center">
          <img src={image} className="w-4 mr-1" />
          <span>{description}</span>
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
          <Label type="transparent" icon={SUNNYSIDE.icons.lightning}>
            <span className="whitespace-nowrap">
              {t("description.boostedSpeed", {
                speed: Number(speed.toFixed(2)),
              })}
            </span>
          </Label>
        )}
        <span className="flex-1 text-center font-secondary">
          {secondsToString(timeLeft, { length: "medium" })}
        </span>
      </div>
    </InnerPanel>
  );
};
