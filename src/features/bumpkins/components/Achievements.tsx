import { useActor } from "@xstate/react";
import React, { useContext } from "react";

import confirm from "assets/icons/confirm.png";
import chest from "assets/icons/chest.png";

import { Context } from "features/game/GameProvider";
import { ACHIEVEMENTS } from "features/game/types/achievements";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import progressBarEdge from "assets/ui/progress/transparent_bar_edge.png";
import progressBar from "assets/ui/progress/transparent_bar_long.png";
import classNames from "classnames";

interface Props {
  onClose: () => void;
}

export const Achievements: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const achievements = ACHIEVEMENTS();
  return (
    <div className="w-full">
      {getKeys(achievements).map((name) => {
        const achievement = achievements[name];

        const progress = achievement.progress(state);
        const isComplete = progress >= achievement.requirement;

        const bumpkinAchievements = state.bumpkin?.achievements || {};
        const isAlreadyClaimed = !!bumpkinAchievements[name];

        return (
          <div className="flex items-center w-full mb-4" key={name}>
            <div className="w-16 h-16 flex justify-center items-center p-3 rounded-md mr-2">
              <img src={ITEM_DETAILS[name].image} className="h-full" />
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
