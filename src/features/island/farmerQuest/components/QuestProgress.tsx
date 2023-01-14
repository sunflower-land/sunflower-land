import React, { useContext } from "react";

import progressBarEdge from "assets/ui/progress/transparent_bar_edge.png";
import progressBar from "assets/ui/progress/transparent_bar_long.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { QuestName, QUESTS } from "features/game/types/quests";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { setPrecision } from "lib/utils/formatNumber";
import { secondsToString } from "lib/utils/time";
import stopwatch from "assets/icons/stopwatch.png";

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
  questName: QuestName;
  onClaim: () => void;
  secondsLeft?: number;
}
export const QuestProgress: React.FC<Props> = ({
  questName,
  onClaim,
  secondsLeft = 0,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const quest = QUESTS[questName];
  const progress = quest.progress(state);
  const isComplete = progress >= quest.requirement;

  const bumpkinWearableId = ITEM_IDS[quest.wearable];

  const progressWidth = Math.min(
    Math.floor(
      (PROGRESS_BAR_DIMENSIONS.innerWidth * progress) / quest.requirement
    ),
    PROGRESS_BAR_DIMENSIONS.innerWidth
  );

  return (
    <div className="flex flex-col justify-center items-center">
      <span className="mb-2">{quest.wearable}</span>
      {secondsLeft ? (
        <span className="bg-blue-600 border flex text-[8px] sm:text-xxs items-center p-[3px] rounded-md whitespace-nowrap">
          <img src={stopwatch} className="w-3 left-0 -top-4 mr-1" />
          <span className="mt-[2px]">{`${secondsToString(
            secondsLeft as number,
            {
              length: "medium",
            }
          )} left`}</span>
        </span>
      ) : null}

      <img
        src={getImageUrl(bumpkinWearableId)}
        className="w-1/3 my-2 rounded-lg"
      />

      <span className="text-sm">{quest.description}</span>

      <div className="flex items-center justify-center pt-1 w-full">
        <div className="flex items-center mt-2 mb-1">
          <div
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.width}px`,
              height: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.height}px`,
            }}
          >
            {/* Progress bar frame */}
            <img
              src={progressBar}
              className="absolute"
              style={{
                left: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft}px`,
                width: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerWidth}px`,
                height: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.height}px`,
              }}
            />
            <img
              src={progressBarEdge}
              className="absolute"
              style={{
                left: `0px`,
                width: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft}px`,
                height: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.height}px`,
              }}
            />
            <img
              src={progressBarEdge}
              className="absolute"
              style={{
                right: `0px`,
                width: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft}px`,
                height: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.height}px`,
                transform: "scaleX(-1)",
              }}
            />
            <div
              className="absolute bg-[#193c3e]"
              style={{
                top: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerTop}px`,
                left: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft}px`,
                width: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerWidth}px`,
                height: `${
                  PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerHeight
                }px`,
              }}
            />

            {/* Progress */}
            <div
              className="absolute bg-[#63c74d]"
              style={{
                top: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerTop}px`,
                left: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft}px`,
                width: `${PIXEL_SCALE * progressWidth}px`,
                height: `${
                  PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerHeight
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
            quest.requirement
          }`}</span>
        </div>
      </div>

      <div className="w-1/2">
        <Button
          className="text-xs mt-2"
          onClick={onClaim}
          disabled={!isComplete}
        >
          <span>Mint Free Wearable</span>
        </Button>
      </div>
    </div>
  );
};
