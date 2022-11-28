import React, { useContext } from "react";

import sflIcon from "assets/icons/token_2.png";
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
import { getKeys } from "features/game/types/craftables";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { setImageWidth } from "lib/images";
import Decimal from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";

const PROGRESS_BAR_DIMENSIONS = {
  width: 80,
  height: 10,
  innerWidth: 76,
  innerHeight: 5,
  innerTop: 2,
  innerLeft: 2,
  innerRight: 2,
};

interface Props {
  onBack: () => void;
  onClaim: () => void;
  name: AchievementName;
  state: GameState;
}

export const AchievementDetails: React.FC<Props> = ({
  onBack,
  onClaim,
  name,
  state,
}) => {
  const achievement = ACHIEVEMENTS()[name];
  const progress = achievement.progress(state);
  const isComplete = progress >= achievement.requirement;

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const isVisiting = gameState.matches("visiting");

  const bumpkinAchievements = state.bumpkin?.achievements || {};
  const isAlreadyClaimed = !!bumpkinAchievements[name];
  const progressWidth = Math.min(
    Math.floor(
      (PROGRESS_BAR_DIMENSIONS.innerWidth * progress) / achievement.requirement
    ),
    PROGRESS_BAR_DIMENSIONS.innerWidth
  );

  return (
    <div className="flex flex-col items-center">
      <OuterPanel className="relative flex-1 w-full flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          <img
            src={arrowLeft}
            className="absolute self-start cursor-pointer"
            style={{
              top: `${PIXEL_SCALE * 2}px`,
              left: `${PIXEL_SCALE * 2}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
            alt="back"
            onClick={onBack}
          />
          <>
            <div className="flex flex-col mb-1 items-center w-full">
              <div className="ml-5 flex mb-1 items-center">
                <span className="text-center text-sm sm:text-base mr-2">
                  {name}
                </span>
                <img
                  src={ITEM_DETAILS[name].image}
                  style={{
                    opacity: 0,
                    marginRight: `${PIXEL_SCALE * 2}px`,
                    marginBottom: `${PIXEL_SCALE * 2}px`,
                  }}
                  onLoad={(e) => setImageWidth(e.currentTarget)}
                />
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex-1 mt-2 text-xxs sm:text-xs flex-wrap justify-center items-center text-center w-full">
                  <p className="text-xs mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-center border-t border-white pt-1 w-full">
                    {!isAlreadyClaimed && (
                      <div className="flex items-center mt-2 mb-1">
                        <div
                          className="absolute"
                          style={{
                            width: `${
                              PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.width
                            }px`,
                            height: `${
                              PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.height
                            }px`,
                          }}
                        >
                          {/* Progress bar frame */}
                          <img
                            src={progressBar}
                            className="absolute"
                            style={{
                              left: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft
                              }px`,
                              width: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerWidth
                              }px`,
                              height: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.height
                              }px`,
                            }}
                          />
                          <img
                            src={progressBarEdge}
                            className="absolute"
                            style={{
                              left: `0px`,
                              width: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft
                              }px`,
                              height: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.height
                              }px`,
                            }}
                          />
                          <img
                            src={progressBarEdge}
                            className="absolute"
                            style={{
                              right: `0px`,
                              width: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft
                              }px`,
                              height: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.height
                              }px`,
                              transform: "scaleX(-1)",
                            }}
                          />
                          <div
                            className="absolute bg-[#193c3e]"
                            style={{
                              top: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerTop
                              }px`,
                              left: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft
                              }px`,
                              width: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerWidth
                              }px`,
                              height: `${
                                PIXEL_SCALE *
                                PROGRESS_BAR_DIMENSIONS.innerHeight
                              }px`,
                            }}
                          />

                          {/* Progress */}
                          <div
                            className="absolute bg-[#63c74d]"
                            style={{
                              top: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerTop
                              }px`,
                              left: `${
                                PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft
                              }px`,
                              width: `${PIXEL_SCALE * progressWidth}px`,
                              height: `${
                                PIXEL_SCALE *
                                PROGRESS_BAR_DIMENSIONS.innerHeight
                              }px`,
                            }}
                          />
                        </div>
                        <span
                          className="text-xxs"
                          style={{
                            marginLeft: `${
                              PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.width + 8
                            }px`,
                          }}
                        >{`${setPrecision(new Decimal(progress))}/${
                          achievement.requirement
                        }`}</span>
                      </div>
                    )}
                    {isAlreadyClaimed && (
                      <div className="flex items-center mt-2 mb-1">
                        <span className="w-auto -mt-2 mb-1 bg-blue-600 text-shadow border text-xxs p-1 rounded-md">
                          Already Claimed!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {!isAlreadyClaimed && (
              <div className="w-full">
                <div className={classNames("flex flex-col items-center", {})}>
                  {achievement.sfl?.gt(0) && (
                    <div className={classNames("flex items-center mt-1", {})}>
                      <img
                        src={sflIcon}
                        style={{
                          width: `${PIXEL_SCALE * 10}px`,
                          marginRight: `${PIXEL_SCALE * 4}px`,
                        }}
                      />
                      <span className="text-xs">{`${achievement.sfl} SFL`}</span>
                    </div>
                  )}
                  {getKeys(achievement.rewards || {}).map((name) => {
                    const amount =
                      achievement.rewards?.[name] || new Decimal(0);
                    const rewardAmount = amount.gt(1) ? `(${amount})` : "";

                    return (
                      <div key={name} className="flex items-center mt-1">
                        <img
                          src={ITEM_DETAILS[name].image}
                          style={{
                            opacity: 0,
                            marginRight: `${PIXEL_SCALE * 4}px`,
                          }}
                          onLoad={(e) => setImageWidth(e.currentTarget)}
                        />
                        <span className="text-xs">{`${name} ${rewardAmount}`}</span>
                      </div>
                    );
                  })}
                </div>
                {!isVisiting && (
                  <Button
                    className="text-xs mt-2"
                    onClick={onClaim}
                    disabled={!isComplete}
                  >
                    <span>Claim</span>
                  </Button>
                )}
              </div>
            )}
          </>
        </div>
      </OuterPanel>
    </div>
  );
};
