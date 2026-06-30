import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { secondsToString } from "lib/utils/time";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  text?: string;
  timeLeft: number;
  showTimeLeft?: boolean;
  /** Current effective recovery speed; shows a lightning + multiplier when > 1. */
  speed?: number;
}

export const TimeLeftPanel: React.FC<Props> = ({
  text = "",
  showTimeLeft = false,
  timeLeft,
  speed,
}) => {
  const { t } = useAppTranslation();
  const isBoosted = speed !== undefined && speed > 1;

  return (
    <InnerPanel
      className={classNames(
        "absolute transition-opacity whitespace-nowrap w-fit z-50 pointer-events-none",
        {
          "opacity-100": showTimeLeft,
          "opacity-0": !showTimeLeft,
        },
      )}
    >
      <div className="flex flex-col text-xs items-center gap-1 mx-1">
        <span className="flex-1">{text}</span>
        <span className="flex-1 font-secondary">
          {secondsToString(timeLeft, {
            length: speed && speed > 1 ? "full" : "medium",
          })}
        </span>
        {isBoosted && (
          <Label type="transparent" icon={SUNNYSIDE.icons.lightning}>
            {t("description.boostedSpeed", {
              speed: Number(speed.toFixed(2)),
            })}
          </Label>
        )}
      </div>
    </InnerPanel>
  );
};
