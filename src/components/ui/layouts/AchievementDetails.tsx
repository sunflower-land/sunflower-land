import React from "react";
import Decimal from "decimal.js-light";
import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { setPrecision } from "lib/utils/formatNumber";
import { ResizableBar } from "../ProgressBar";
import { SquareIcon } from "../SquareIcon";
import token from "assets/icons/token_2.png";
import { getKeys } from "features/game/types/craftables";
import { Label } from "../Label";

/**
 * The props for the component.
 * @param gameState The game state.
 * @param details The achievement details.
 * @param showRewards Whether to show the achievement rewards or not.
 * @param actionView The view for displaying the achievement action.
 */
interface Props {
  gameState: GameState;
  details: AchievementDetailsProps;
  showRewards: boolean;
  actionView?: JSX.Element;
}

/**
 * The props for the details for achievements.
 * @param achievement The achievement.
 */
interface AchievementDetailsProps {
  achievement: AchievementName;
}

/**
 * The view for displaying achievement name, details, achievement requirements and action.
 * @props The component props.
 */
export const AchievementDetails: React.FC<Props> = ({
  gameState,
  details,
  showRewards,
  actionView,
}: Props) => {
  const achievement = ACHIEVEMENTS()[details.achievement];

  const getAchievementDetail = () => {
    const icon = ITEM_DETAILS[details.achievement].image;
    const title = details.achievement;
    const description = achievement.description;

    return (
      <>
        <div className="flex space-x-2 justify-start mb-1 items-center sm:flex-col-reverse md:space-x-0">
          {icon && (
            <div className="sm:mt-2">
              <SquareIcon icon={icon} width={14} />
            </div>
          )}
          <span className="sm:text-center">{title}</span>
        </div>
        <span className="text-xs mt-1 whitespace-pre-line sm:text-center">
          {description}
        </span>
      </>
    );
  };

  const getProgressRequirement = () => {
    const requirement = achievement.requirement;
    const progress = achievement.progress(gameState);

    return (
      <div className="flex w-full items-center sm:flex-col-reverse">
        <ResizableBar
          percentage={(progress / requirement) * 100}
          type="progress"
          outerDimensions={{ width: 50, height: 7 }}
        />
        <span className="text-xxs ml-1 mb-0.5 sm:mb-1">{`${setPrecision(
          new Decimal(progress)
        )}/${requirement}`}</span>
      </div>
    );
  };

  const getRequirements = () => {
    return (
      <div className="border-t border-white w-full my-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap flex-col sm:items-center sm:flex-nowrap">
        {getProgressRequirement()}
      </div>
    );
  };

  const getRewards = () => {
    return (
      <div className="w-full my-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap">
        <span className="text-xs w-full sm:text-center">Rewards:</span>
        {getKeys(achievement.rewards || {}).map((name) => {
          const amount = achievement.rewards?.[name] || new Decimal(0);
          const rewardAmount = amount.gt(1) ? `(${amount})` : "";

          return (
            <div key={name} className="flex items-center">
              <SquareIcon icon={ITEM_DETAILS[name].image} width={7} />
              <Label type="transparent">{`${name} ${rewardAmount}`}</Label>
            </div>
          );
        })}
        {achievement.sfl?.gt(0) && (
          <div className="flex items-center">
            <SquareIcon icon={token} width={7} />
            <span className="text-xxs ml-1">{`${setPrecision(
              achievement.sfl ?? new Decimal(0)
            )}`}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col justify-center p-2 pb-0">
        {getAchievementDetail()}
        {getRequirements()}
        {showRewards && getRewards()}
      </div>
      {actionView}
    </div>
  );
};
