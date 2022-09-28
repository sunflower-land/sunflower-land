import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import confirm from "assets/icons/confirm.png";
import chest from "assets/icons/chest.png";
import disc from "assets/icons/disc.png";
import sflIcon from "assets/icons/token.png";
import experience from "assets/icons/experience.png";
import arrowLeft from "assets/icons/arrow_left.png";

import { Context } from "features/game/GameProvider";
import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import progressBarEdge from "assets/ui/progress/transparent_bar_edge.png";
import progressBar from "assets/ui/progress/transparent_bar_long.png";
import classNames from "classnames";
import { Button } from "components/ui/Button";

interface Props {
  onClose: () => void;
}

export const Achievements: React.FC<Props> = ({ onClose }) => {
  const [claiming, setClaiming] = useState<AchievementName | null>();

  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const achievements = ACHIEVEMENTS();

  const claim = () => {
    console.log("TODO");
    setClaiming(null);
  };

  if (claiming) {
    const claimingAchievement = achievements[claiming];
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <div
            className={classNames(
              "w-8 h-8 flex justify-center items-center p-1 rounded-md mr-2 relative"
            )}
          >
            <img src={ITEM_DETAILS[claiming].image} className="h-full z-10" />
            <img src={disc} className="absolute inset-0 w-full" />
          </div>
          <span className="text-sm">{`${claiming} badge`}</span>
        </div>
        {claimingAchievement.sflReward && (
          <div className="flex items-center mt-2">
            <img src={sflIcon} className="h-8 z-10 mr-2" />
            <span className="text-sm">{`${claimingAchievement.sflReward} SFL`}</span>
          </div>
        )}
        {claimingAchievement.experienceReward && (
          <div className="flex items-center mt-2">
            <img src={experience} className="h-8 z-10 mr-2" />
            <span className="text-sm">{`${claimingAchievement.experienceReward} Exp`}</span>
          </div>
        )}
        <Button className="text-sm mt-2" onClick={claim}>
          Claim
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <img
          src={arrowLeft}
          className="w-8 mr-7 cursor-pointer"
          onClick={onClose}
        />
        <span>Achievements</span>
      </div>
      {getKeys(achievements).map((name) => {
        const achievement = achievements[name];

        const progress = achievement.progress(state);
        const isComplete = progress >= achievement.requirement;

        const bumpkinAchievements = state.bumpkin?.achievements || {};
        const isAlreadyClaimed = !!bumpkinAchievements[name];

        return (
          <div className="flex items-center w-full mb-4" key={name}>
            <div
              className={classNames(
                "w-14 h-14 flex justify-center items-center p-2.5 rounded-md mr-2 relative",
                {
                  "opacity-50": !isComplete,
                }
              )}
            >
              <img src={ITEM_DETAILS[name].image} className="h-full z-10" />
              <img src={disc} className="absolute inset-0 w-full" />
            </div>
            <div className="flex-1 pr-2">
              <p className="text-sm underline mb-0.5">{name}</p>
              <p className="text-xs">{achievement.description}</p>
              {/* <p className="text-xs">{`Progress: ${progress}/${achievement.requirement}`}</p> */}
              <div className="flex items-center justify-center relative w-full h-6 mt-1 z-10">
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
                <span className="text-xxs text-white">{`${progress}/${achievement.requirement}`}</span>
              </div>
            </div>

            {isAlreadyClaimed ? (
              <div
                className={classNames(
                  "w-20 p-2 flex flex-col items-center justify-center"
                )}
              >
                <img
                  src={confirm}
                  className="w-12 h-12 group-hover:img-highlight"
                />
              </div>
            ) : (
              <div
                onClick={() => setClaiming(name)}
                className={classNames(
                  "w-20 p-2 flex flex-col items-center justify-center cursor-pointer group",
                  {
                    "opacity-50": !isComplete,
                    "cursor-not-allowed": !isComplete,
                  }
                )}
              >
                <img
                  src={chest}
                  className="w-12 h-12 group-hover:img-highlight"
                />
                <p className="text-xs">Claim</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
