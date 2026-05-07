import React from "react";

import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";
import { BoostName, GameState } from "features/game/types/game";
import {
  getBoostIcon,
  getBoostLabel,
} from "components/ui/layouts/BoostsDisplay";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  showPopover: boolean;
  image: string;
  description: string;
  timeLeft: number;
  secondaryImage?: string | undefined;
  secondaryDescription?: string;
  boosts?: { name: BoostName; value: string }[];
  state?: GameState;
}

export const TimerPopover: React.FC<Props> = ({
  showPopover,
  image,
  description,
  timeLeft,
  secondaryImage,
  secondaryDescription,
  boosts,
  state,
}) => {
  const { t } = useAppTranslation();
  const hasSecondRow = secondaryImage != null || secondaryDescription != null;
  const hasBoosts = !!boosts?.length && !!state;

  return (
    <InnerPanel
      className={classNames(
        "transition-opacity absolute whitespace-nowrap max-w-[140px] z-50 pointer-events-none",
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
        <span className="flex-1 text-center font-secondary">
          {secondsToString(timeLeft, { length: "medium" })}
        </span>
        {hasBoosts &&
          boosts.map((buff, index) => (
            <div
              key={`${buff.name}-${buff.value}-${index}`}
              className="flex items-center max-w-[10rem]"
            >
              <img
                src={getBoostIcon(buff.name, state!)}
                className="w-4 h-4 mr-1 flex-shrink-0 object-contain"
              />
              <span className="truncate text-xxs">
                {`${buff.value} ${getBoostLabel(buff.name, t)}`}
              </span>
            </div>
          ))}
      </div>
    </InnerPanel>
  );
};
