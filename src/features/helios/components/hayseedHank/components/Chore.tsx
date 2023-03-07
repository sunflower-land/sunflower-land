import { useActor } from "@xstate/react";
import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Bumpkin } from "features/game/types/game";

import progressBarEdge from "assets/ui/progress/transparent_bar_edge.png";
import progressBar from "assets/ui/progress/transparent_bar_long.png";
import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

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
  onClose: () => void;
}
export const Chore: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { setToast } = useContext(ToastContext);

  const hayseedHank = gameState.context.state.hayseedHank;
  const chore = hayseedHank.chore;
  const bumpkin = gameState.context.state.bumpkin as Bumpkin;
  const start = () => {
    gameService.send("chore.started");
  };

  const complete = () => {
    getKeys(chore.reward.items).forEach((name) => {
      setToast({
        icon: ITEM_DETAILS[name].image,
        content: `+${chore.reward.items[name]?.toString()}`,
      });
    });

    gameService.send("chore.completed");

    gameService.send("SAVE");
  };

  if (!hayseedHank.progress && gameState.matches("autosaving")) {
    return (
      <div className="flex justify-center">
        <p className="loading text-center my-4">Loading</p>
      </div>
    );
  }

  if (!hayseedHank.progress) {
    return (
      <>
        <div className="p-2 flex flex-col items-center w-full relative -top-4">
          <div className="flex mt-1 mb-3">
            <p>{chore.description}</p>
          </div>
          <Label type="info">Reward</Label>

          {getKeys(chore.reward.items).map((name) => (
            <div className="flex mt-1" key={name}>
              <p className="text-sm">{`${name} x ${chore.reward.items[name]}`}</p>
              <img
                src={ITEM_DETAILS[name].image}
                className="h-6 ml-2 text-sm"
              />
            </div>
          ))}
        </div>
        <Button onClick={start}>Start</Button>
      </>
    );
  }

  if (hayseedHank.progress.bumpkinId !== bumpkin.id) {
    return (
      <>
        <div className="p-2">
          <p>{`You aren't the same Bumpkin I last spoke with!`}</p>
        </div>
        <Button onClick={start}>Start New Chore</Button>
      </>
    );
  }

  const progress =
    (bumpkin.activity?.[chore.activity] ?? 0) - hayseedHank.progress.startCount;

  const isComplete = progress >= chore.requirement;

  const progressWidth = Math.min(
    Math.floor(
      (PROGRESS_BAR_DIMENSIONS.innerWidth * progress) / chore.requirement
    ),
    PROGRESS_BAR_DIMENSIONS.innerWidth
  );

  return (
    <>
      <div className="p-2 flex flex-col items-center w-full relative -top-4">
        <div className="flex mt-1 mb-1">
          <p>{chore.description}</p>
        </div>

        <div className="flex items-center justify-center pt-1 w-full">
          <div className="flex items-center mt-2">
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
                  width: `${
                    PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerWidth
                  }px`,
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
                  width: `${
                    PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerWidth
                  }px`,
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
              chore.requirement
            }`}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mb-1">
        <Label type="info">Reward</Label>

        {getKeys(chore.reward.items).map((name) => (
          <div className="flex mt-1" key={name}>
            <p className="text-sm">{`${name} x ${chore.reward.items[name]}`}</p>
            <img src={ITEM_DETAILS[name].image} className="h-6 ml-2 text-sm" />
          </div>
        ))}
      </div>
      <Button disabled={!isComplete} onClick={() => complete()}>
        Complete
      </Button>
    </>
  );
};
