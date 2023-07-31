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
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  skipping: boolean;
}
export const ChoreV2: React.FC<Props> = ({ skipping }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const chores = gameState.context.state.chores;

  if (!chores) {
    return (
      <div className="p-2 text-sm">
        <p>{`Sorry, I don't have any chores that need doing right now.`}</p>
      </div>
    );
  }
  const choreKey = getKeys(chores).find((key) => !chores[key].completedAt);

  if (!choreKey) {
    return (
      <div className="p-2 text-sm">
        <p>{`Come back tomorrow for another chore!`}</p>
      </div>
    );
  }
  const chore = chores[choreKey];

  const bumpkin = gameState.context.state.bumpkin as Bumpkin;

  const progress =
    (bumpkin?.activity?.[chore.activity] ?? 0) - chore.startCount;
  const isTaskComplete = progress > chore.requirement;

  const start = () => {
    gameService.send("chore.started");
  };

  const complete = () => {
    gameService.send("chore.completed", { id: Number(choreKey) });

    gameService.send("SAVE");
  };

  if (skipping) return <Loading text="Skipping" />;

  if (chore.bumpkinId !== bumpkin.id) {
    return (
      <>
        <div className="p-2 text-sm">
          <p>{`You aren't the same Bumpkin I last spoke with!`}</p>
        </div>
        <Button onClick={start}>Start New Chore</Button>
      </>
    );
  }

  if (isTaskComplete) {
    return (
      <div className="flex flex-col items-center">
        <img
          src={SUNNYSIDE.icons.confirm}
          style={{ width: `${PIXEL_SCALE * 16}px` }}
        />

        {getKeys(chore.reward.items ?? {}).length > 0 ? (
          <div className="flex flex-col items-center mb-3 mt-2">
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
        ) : (
          <p className="text-sm my-2">{`You've got a knack for this!`}</p>
        )}
        <Button onClick={() => complete()}>Complete</Button>
      </div>
    );
  }

  const progressPercentage = Math.min(1, progress / chore.requirement) * 100;

  return (
    <>
      <div className="px-2 flex flex-col w-full relative mb-2">
        <OuterPanel className="w-full mt-1">
          <div className="pt-1">
            <p className="text-sm text-center">{`Task: ${chore.description}`}</p>
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
