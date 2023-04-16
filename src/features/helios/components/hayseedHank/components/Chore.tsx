import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Bumpkin } from "features/game/types/game";

import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { getProgress, isTaskComplete } from "../lib/HayseedHankTask";
import { ResizableBar } from "components/ui/ProgressBar";
import { Chore as IChore } from "features/game/types/chores";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  onClose: () => void;
}
export const Chore: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const hayseedHank = gameState.context.state.hayseedHank;
  const chore = hayseedHank.chore;
  const bumpkin = gameState.context.state.bumpkin as Bumpkin;

  const start = () => {
    gameService.send("chore.started");
  };

  const complete = () => {
    gameService.send("chore.completed");

    gameService.send("SAVE");
  };

  console.log({ chore, hayseedHank });
  if (!chore) {
    return <Loading />;
  }

  if (hayseedHank.progress?.bumpkinId !== bumpkin.id) {
    return (
      <>
        <div className="p-2 text-sm">
          <p>{`You aren't the same Bumpkin I last spoke with!`}</p>
        </div>
        <Button onClick={start}>Start New Chore</Button>
      </>
    );
  }

  if (isTaskComplete(hayseedHank, gameState.context.state)) {
    return (
      <div className="flex flex-col items-center">
        <img
          src={SUNNYSIDE.icons.confirm}
          style={{ width: `${PIXEL_SCALE * 16}px` }}
        />
        <p className="text-sm my-2">You've got a knack for this!</p>
        <Button onClick={() => complete()}>Complete</Button>
      </div>
    );
  }

  const progress = getProgress(hayseedHank, gameState.context.state);

  const progressPercentage = Math.min(1, progress / chore.requirement) * 100;

  return (
    <>
      <div className="px-2 flex flex-col  w-full relative mb-2">
        <p className="text-sm text-center">{chore.introduction}</p>
        {chore.image && (
          <img src={chore.image} className="w-2/3 mx-auto rounded-lg my-1" />
        )}
        <OuterPanel className="w-2/3 mx-auto mt-1">
          <div className=" pt-2 text-center">
            <p className="text-sm">{`Task: ${chore.action}`}</p>
          </div>

          <div className="flex items-center justify-center my-2">
            <ResizableBar
              percentage={progressPercentage}
              type="progress"
              outerDimensions={{
                width: 40,
                height: 8,
              }}
            />
            <span className="text-xxs ml-2">{`${setPrecision(
              new Decimal(progress)
            )}/${chore.requirement}`}</span>
          </div>
        </OuterPanel>
        {/* <div className="flex items-center justify-center pt-1 w-full">
          <div className="flex items-center mt-2">
            <ResizableBar
              percentage={progressPercentage}
              type="progress"
              outerDimensions={{
                width: 40,
                height: 8,
              }}
            />
            <span className="text-xxs ml-2">{`${setPrecision(
              new Decimal(progress)
            )}/${chore.requirement}`}</span>
          </div>
        </div> */}
      </div>
      {getKeys(chore.reward.items ?? {}).length > 0 && (
        <div className="flex flex-col items-center mb-3">
          <Label type="info">Reward</Label>

          {getKeys(chore.reward.items ?? {}).map((name) => (
            <div className="flex mt-1" key={name}>
              <p className="text-sm whitespace-nowrap">{`${name} x ${chore.reward.items?.[name]}`}</p>
              <img
                src={ITEM_DETAILS[name].image}
                className="h-6 ml-2 text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
