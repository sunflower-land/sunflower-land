import React from "react";

import sflIcon from "assets/icons/token_2.png";
import experience from "assets/icons/experience.png";
import arrowLeft from "assets/icons/arrow_left.png";

import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import progressBarEdge from "assets/ui/progress/transparent_bar_edge.png";
import progressBar from "assets/ui/progress/transparent_bar_long.png";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { GameState } from "features/game/types/game";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";

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
      <OuterPanel className="relative flex-1 w-full flex flex-col justify-between items-center shadow-none">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          <img
            src={arrowLeft}
            className="absolute top-[7px] left-1 self-start w-5 cursor-pointer"
            alt="back"
            onClick={onClose}
          />
          <>
            <div className="flex flex-col mb-1 items-center w-full">
              <div className="ml-5 flex mb-1 items-center">
                <span className="text-shadow text-center text-sm sm:text-base mr-2">
                  {name}
                </span>
                <img
                  src={ITEM_DETAILS[name].image}
                  className="object-scale-down"
                />
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex-1 mt-2 text-xxs sm:text-xs flex-wrap justify-center items-center text-center w-full">
                  <p className="text-xs mb-2">{achievement.description}</p>
                  <div className="flex items-center border-t border-white justify-center pt-1 w-full">
                    <div className="flex items-center justify-center mt-2 mb-1">
                      <div className="flex items-center justify-center relative w-40 h-4 z-10">
                        <img
                          src={progressBar}
                          className="absolute w-full h-full"
                        />
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
                            width: `${
                              (progress / achievement.requirement) * 100
                            }%`,
                            maxWidth: "100%",
                            borderRight: "3px solid #418848",
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xxs text-white ml-2 mt-1">{`${progress}/${achievement.requirement}`}</span>
                  </div>
                </div>
              </div>
            </div>
            {!isAlreadyClaimed && (
              <div className="w-full">
                <div
                  className={classNames("flex flex-col items-center", {
                    "opacity-60": !isComplete,
                  })}
                >
                  {!!achievement.sflReward && (
                    <div className="flex items-center mt-1">
                      <img src={sflIcon} className="h-5 z-10 mr-2" />
                      <span className="text-xxs">{`${achievement.sflReward} SFL`}</span>
                    </div>
                  )}
                  {!!achievement.experienceReward && (
                    <div className="flex items-center mt-1">
                      <img src={experience} className="h-5 z-10 mr-2" />
                      <span className="text-xxs">{`${achievement.experienceReward} Exp`}</span>
                    </div>
                  )}
                </div>
                <Button
                  className="text-xs mt-2"
                  onClick={onClaim}
                  disabled={!isComplete}
                >
                  <span>Claim</span>
                </Button>
              </div>
            )}
          </>
        </div>
      </OuterPanel>
    </div>
  );
};
