import React, { useContext } from "react";

import progressBarEdge from "assets/ui/progress/transparent_bar_edge.png";
import progressBar from "assets/ui/progress/transparent_bar_long.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { QUESTS } from "features/game/types/quests";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "features/goblins/tailor/TabContent";

const PROGRESS_BAR_DIMENSIONS = {
  width: 80,
  height: 10,
  innerWidth: 76,
  innerHeight: 5,
  innerTop: 2,
  innerLeft: 2,
  innerRight: 2,
};

export const FarmerQuestProgress: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const claim = () => {
    console.log("mint a free item for the player");
  };

  const quest = QUESTS()["Farmer Quest 1"];
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
      <span>{quest.wearable}</span>
      <img
        src={getImageUrl(bumpkinWearableId)}
        className="w-1/3 my-2 rounded-lg"
      />

      <span>Harvest 1000 Sunflowers</span>
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
          >{`${new Decimal(progress).toDecimalPlaces(4, Decimal.ROUND_DOWN)}/${
            quest.requirement
          }`}</span>
        </div>
      </div>

      <div className="w-1/2">
        <Button className="text-xs mt-2" onClick={claim} disabled={!isComplete}>
          <span>Claim</span>
        </Button>
      </div>
    </div>
  );
};
