import { useActor } from "@xstate/react";
import React, { useContext } from "react";

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

interface Props {
  onClose: () => void;
}
export const Chore: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const autosaving = gameState.matches("autosaving");

  const hayseedHank = gameState.context.state.hayseedHank;
  const chore = hayseedHank.chore;
  const bumpkin = gameState.context.state.bumpkin as Bumpkin;

  const start = () => {
    gameService.send("chore.started");

    onClose();
  };

  const complete = () => {
    gameService.send("chore.completed");

    gameService.send("SAVE");
  };

  if (!hayseedHank.progress && autosaving) {
    return <Loading />;
  }

  if (!hayseedHank.progress) {
    return (
      <>
        <div className="flex flex-col items-center w-full relative mb-2">
          <div className="flex mt-1 mb-3">
            <p>{chore.description}</p>
          </div>
          <Label type="info">Reward</Label>

          {getKeys(chore.reward.items ?? {}).map((name) => (
            <div className="flex items-center mt-1" key={name}>
              <p className="text-sm whitespace-nowrap">{`${name} x ${chore.reward.items?.[name]}`}</p>
              <img
                src={ITEM_DETAILS[name].image}
                className="w-6 h-6 object-contain ml-2 text-sm"
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
        <div className="p-2 text-sm">
          <p>{`You aren't the same Bumpkin I last spoke with!`}</p>
        </div>
        <Button onClick={start}>Start New Chore</Button>
      </>
    );
  }

  const progress = getProgress(hayseedHank, bumpkin);

  const progressPercentage = Math.min(1, progress / chore.requirement) * 100;

  return (
    <>
      <div className="p-2 flex flex-col items-center w-full relative mb-2">
        <div className="flex mt-1 mb-1">
          <p>{chore.description}</p>
        </div>

        <div className="flex items-center justify-center pt-1 w-full">
          <div className="flex items-center mt-2">
            <ResizableBar
              percentage={progressPercentage}
              type="progress"
              outerDimensions={{
                width: 80,
                height: 10,
              }}
            />
            <span className="text-xxs ml-2">{`${setPrecision(
              new Decimal(progress)
            )}/${chore.requirement}`}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mb-3">
        <Label type="info">Reward</Label>

        {getKeys(chore.reward.items ?? {}).map((name) => (
          <div className="flex mt-1" key={name}>
            <p className="text-sm whitespace-nowrap">{`${name} x ${chore.reward.items?.[name]}`}</p>
            <img src={ITEM_DETAILS[name].image} className="h-6 ml-2 text-sm" />
          </div>
        ))}
      </div>
      <Button
        disabled={!isTaskComplete(hayseedHank, bumpkin)}
        onClick={() => complete()}
      >
        Complete
      </Button>
    </>
  );
};
