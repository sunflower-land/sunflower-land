import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import alert from "assets/icons/expression_alerted.png";
import confirm from "assets/icons/confirm.png";
import disc from "assets/icons/disc.png";
import arrowLeft from "assets/icons/arrow_left.png";

import { Context } from "features/game/GameProvider";
import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import { AchievementDetails } from "./AchievementDetails";
import Decimal from "decimal.js-light";
import { shortenCount } from "lib/utils/formatNumber";

const CONTENT_HEIGHT = 350;
interface Props {
  onClose: () => void;
}

export const Achievements: React.FC<Props> = ({ onClose }) => {
  const [selected, setSelected] = useState<AchievementName | null>();

  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const achievements = ACHIEVEMENTS();

  const claim = () => {
    console.log("TODO");
  };

  if (selected) {
    return (
      <AchievementDetails
        name={selected}
        onClose={() => setSelected(null)}
        onClaim={claim}
        gameState={state}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <img
          src={arrowLeft}
          className="w-8 mr-7 cursor-pointer"
          onClick={onClose}
        />
        <span>Achievements</span>
      </div>

      <div
        style={{ maxHeight: CONTENT_HEIGHT }}
        className="overflow-y-auto scrollable flex flex-wrap"
      >
        {getKeys(achievements).map((name) => {
          const achievement = achievements[name];

          const progress = achievement.progress(state);
          const isComplete = progress >= achievement.requirement;

          const bumpkinAchievements = state.bumpkin?.achievements || {};
          const isAlreadyClaimed = !!bumpkinAchievements[name];

          return (
            <div
              className="flex flex-col items-center mb-2 w-1/3 sm:w-1/4"
              key={name}
            >
              {/* <p className="text-xs mb-0.5">{name}</p> */}

              <div
                onClick={() => setSelected(name)}
                className={classNames(
                  "w-14 h-14 flex justify-center items-center p-2.5 rounded-md mr-2 relative cursor-pointer hover:img-highlight",
                  {
                    "opacity-50": !isAlreadyClaimed,
                  }
                )}
              >
                <img src={ITEM_DETAILS[name].image} className="h-full z-10" />
                <img src={disc} className="absolute inset-0 w-full" />
              </div>

              <div className="h-12">
                {isComplete && !isAlreadyClaimed && (
                  <div className=" flex flex-1 pr-2 mt-1.5 text-xs flex-wrap justify-center">
                    <img src={alert} className="h-6 object-fit" />
                  </div>
                )}
                {isAlreadyClaimed && (
                  <div className=" flex flex-1 pr-2 mt-1.5 text-xs flex-wrap justify-center">
                    <img src={confirm} className=" h-6 object-fit" />
                  </div>
                )}
                {!isComplete && !isAlreadyClaimed && (
                  <div className=" flex flex-1  mt-1.5 text-xs flex-wrap justify-center">
                    <p>{shortenCount(new Decimal(progress))}</p>
                    <p>/</p>
                    <p>{shortenCount(new Decimal(achievement.requirement))}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
