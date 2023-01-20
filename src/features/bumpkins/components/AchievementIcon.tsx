import React from "react";
import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import { shortenCount } from "lib/utils/formatNumber";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setImageWidth } from "lib/images";
import { Bar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameState } from "features/game/types/game";

interface Props {
  gameState: GameState;
  name: AchievementName;
  isSelected: boolean;
}

export const AchievementIcon: React.FC<Props> = ({
  gameState: state,
  name,
  isSelected,
}) => {
  const achievement = ACHIEVEMENTS()[name];
  const progress = achievement.progress(state);
  const isComplete = progress >= achievement.requirement;

  const bumpkinAchievements = state.bumpkin?.achievements || {};
  const isAlreadyClaimed = !!bumpkinAchievements[name];

  return (
    <div className="flex flex-col items-center mb-1 w-1/3 sm:w-1/4">
      {/* Achievement icon */}
      <div
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 23}px`,
        }}
        className={classNames(
          "flex justify-center items-center p-1 rounded-md relative",
          {
            "opacity-50": !isAlreadyClaimed && !isComplete,
            "img-highlight hover:img-highlight-heavy": isSelected,
            "hover:img-highlight": !isSelected,
          }
        )}
      >
        <img
          src={SUNNYSIDE.icons.disc}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <img
          src={ITEM_DETAILS[name].image}
          className="absolute pointer-events-none"
          style={{
            opacity: 0,
            marginBottom: `${PIXEL_SCALE * 0.5}px`,
          }}
          onLoad={(e) => setImageWidth(e.currentTarget)}
        />
      </div>

      {/* Achievement indicator */}
      <div className="h-10">
        {/* Ready to claim */}
        {isComplete && !isAlreadyClaimed && (
          <div className="flex flex-1 mt-1.5 text-xs flex-wrap justify-center">
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              style={{
                width: `${PIXEL_SCALE * 4}px`,
              }}
            />
          </div>
        )}

        {/* Claimed */}
        {isAlreadyClaimed && (
          <div className="flex flex-1 mt-1.5 text-xs flex-wrap justify-center">
            <img
              src={SUNNYSIDE.icons.confirm}
              style={{
                width: `${PIXEL_SCALE * 12}px`,
              }}
            />
          </div>
        )}

        {/* In progress */}
        {!isComplete && !isAlreadyClaimed && (
          <div className="flex flex-col flex-1 mt-0.5 items-center justify-center">
            <p className="mb-1 text-xxs text-center">{`${shortenCount(
              new Decimal(progress)
            )}/${shortenCount(new Decimal(achievement.requirement))}`}</p>
            <Bar
              percentage={(progress / achievement.requirement) * 100}
              type="progress"
            />
          </div>
        )}
      </div>
    </div>
  );
};
