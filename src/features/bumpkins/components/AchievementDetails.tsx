import React from "react";

import chest from "assets/icons/chest.png";
import disc from "assets/icons/disc.png";
import sflIcon from "assets/icons/token.png";
import experience from "assets/icons/experience.png";
import arrowLeft from "assets/icons/arrow_left.png";

import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import { ITEM_DETAILS } from "features/game/types/images";
import progressBarEdge from "assets/ui/progress/transparent_bar_edge.png";
import progressBar from "assets/ui/progress/transparent_bar_long.png";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { GameState } from "features/game/types/game";

interface Props {
  onClose: () => void;
  onClaim: () => void;
  name: AchievementName;
  gameState: GameState;
}

export const AchievementDetails: React.FC<Props> = ({
  onClose,
  onClaim,
  name,
  gameState,
}) => {
  const achievement = ACHIEVEMENTS()[name];
  const progress = achievement.progress(gameState);
  const isComplete = progress >= achievement.requirement;

  const bumpkinAchievements = gameState.bumpkin?.achievements || {};
  const isAlreadyClaimed = !!bumpkinAchievements[name];

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex justify-center mb-2 w-full relative text-center px-10"
        style={{
          minHeight: "4rem",
        }}
      >
        <img
          src={arrowLeft}
          className="w-8 mr-7 cursor-pointer absolute left-2 top-0"
          onClick={onClose}
        />
        <span className="text-center text-lg mt-0.5">{name}</span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div
          className={classNames(
            "w-20 h-20 flex justify-center items-center mb-2 p-2.5 rounded-md mr-2 relative cursor-pointer hover:img-highlight",
            {
              "opacity-50": !isComplete,
            }
          )}
        >
          <img src={ITEM_DETAILS[name].image} className="h-full z-10" />
          <img src={disc} className="absolute inset-0 w-full" />
        </div>

        <div className="flex flex-col items-center justify-center">
          {/* <p className="text-lg underline">{name}</p> */}
          <div className="flex-1 mt-1.5 text-xs flex-wrap justify-center items-center text-center">
            <p className="text-sm mb-1">{achievement.description}</p>

            <div className="flex items-center justify-center  mt-1 mb-1">
              <div className="flex items-center justify-center relative w-40 h-4 z-10">
                <img src={progressBar} className="absolute w-full h-full" />
                <img
                  src={progressBarEdge}
                  className="absolute top-0 left-[-2px] h-full"
                />
                <img
                  src={progressBarEdge}
                  className="absolute top-0 right-[-2px] h-full"
                  style={{
                    transform: "scaleX(-1)",
                  }}
                />
                <div className="w-full h-full bg-[#193c3e] absolute -z-20" />
                <div
                  className="h-full bg-[#63c74d] absolute -z-10 left-0"
                  style={{
                    width: `${(progress / achievement.requirement) * 100}%`,
                    maxWidth: "100%",
                    borderRight: "3px solid #418848",
                  }}
                />
              </div>
            </div>
            <span className="text-xs text-white ml-2 mt-1">{`${progress}/${achievement.requirement}`}</span>
          </div>
        </div>
      </div>

      {!isAlreadyClaimed && (
        <div
          className={classNames("mt-4", {
            "opacity-50": !isComplete,
          })}
        >
          <div className="flex">
            {!!achievement.sflReward && (
              <div className="flex items-center mt-2 mr-3">
                <img src={sflIcon} className="h-6 z-10 mr-2" />
                <span className="text-xs">{`${achievement.sflReward} SFL`}</span>
              </div>
            )}
            {!!achievement.experienceReward && (
              <div className="flex items-center mt-2">
                <img src={experience} className="h-6 z-10 mr-2" />
                <span className="text-xs">{`${achievement.experienceReward} Exp`}</span>
              </div>
            )}
          </div>
          <Button
            className="text-sm mt-2"
            onClick={onClaim}
            disabled={!isComplete}
          >
            <span>Claim</span>
            <img src={chest} className="w-6 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};
