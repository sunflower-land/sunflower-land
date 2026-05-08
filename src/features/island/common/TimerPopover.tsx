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
import { hasFeatureAccess } from "lib/flags";

interface Props {
  showPopover: boolean;
  image: string;
  description: string;
  timeLeft: number;
  secondaryImage?: string | undefined;
  secondaryDescription?: string;
  boosts?: { name: BoostName; value: string }[];
  chanceBoosts?: { name: BoostName; value: string; chance: number }[];
  state?: GameState;
}

const formatChance = (chance: number): string =>
  Number.isInteger(chance) ? `${chance}%` : `${chance.toFixed(1)}%`;

export const TimerPopover: React.FC<Props> = ({
  showPopover,
  image,
  description,
  timeLeft,
  secondaryImage,
  secondaryDescription,
  boosts,
  chanceBoosts,
  state,
}) => {
  const { t } = useAppTranslation();
  const hasSecondRow = secondaryImage != null || secondaryDescription != null;

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
        <span className="flex-1 text-center font-secondary">
          {secondsToString(timeLeft, { length: "medium" })}
        </span>
        {!!state &&
          hasFeatureAccess(state, "BOOSTS_DISPLAY") &&
          boosts?.map((buff) => {
            const label = getBoostLabel(buff.name, t);
            return (
              <div key={buff.name} className="flex items-center max-w-[10rem]">
                <img
                  src={getBoostIcon(buff.name, state)}
                  alt={label}
                  className="w-4 h-4 mr-1 flex-shrink-0 object-contain"
                />
                <span className="truncate text-xxs">
                  {`${buff.value} ${label}`}
                </span>
              </div>
            );
          })}
        {!!state &&
          hasFeatureAccess(state, "BOOSTS_DISPLAY") &&
          chanceBoosts?.map((buff) => {
            const label = getBoostLabel(buff.name, t);
            return (
              <div
                key={`chance-${buff.name}`}
                className="flex items-center max-w-[10rem]"
              >
                <img
                  src={getBoostIcon(buff.name, state)}
                  alt={label}
                  className="w-4 h-4 mr-1 flex-shrink-0 object-contain"
                />
                <span className="text-xxs">
                  {`${buff.value} ${label} (${formatChance(buff.chance)})`}
                </span>
              </div>
            );
          })}
      </div>
    </InnerPanel>
  );
};
