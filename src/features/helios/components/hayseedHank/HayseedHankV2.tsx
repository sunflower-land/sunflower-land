import React, { useContext, useState } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { NPC_WEARABLES } from "lib/npcs";
import { ChoreV2 } from "./components/ChoreV2";
import { getKeys } from "features/game/types/craftables";

interface Props {
  onClose: () => void;
}
export const HayseedHankV2: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isSkipping, setIsSkipping] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { chores, bumpkin } = gameState.context.state;

  const choreKey =
    chores && getKeys(chores).find((key) => !chores[key].completedAt);
  const chore = choreKey !== undefined ? chores?.[choreKey] : undefined;
  const startedAt = chore?.createdAt;

  const isTaskComplete = chore
    ? (bumpkin?.activity?.[chore.activity] ?? 0) - chore.startCount >
      chore.requirement
    : false;

  const isSaving = gameState.matches("autosaving");

  const skip = () => {
    setIsSkipping(true);
    gameService.send("chore.skipped", { id: Number(choreKey) });
    gameService.send("SAVE");
    setIsDialogOpen(false);
    setCanSkip(false);
  };

  const close = () => {
    onClose();
    setIsSkipping(false);
    setIsDialogOpen(false);
  };

  const getTimeToChore = () => {
    if (!startedAt) return;
    const twentyFourHrsInMilliseconds = 86400000;

    // if startedAt is more than 24hrs ago, can skip
    if (new Date().getTime() > startedAt + twentyFourHrsInMilliseconds) {
      setCanSkip(true);
      return;
    }

    const now = new Date().getTime();
    const timeToChore = new Date(startedAt + twentyFourHrsInMilliseconds - now);

    return `${timeToChore.getUTCHours()}hrs ${timeToChore.getUTCMinutes()}min`;
  };

  const Content = () => {
    return (
      <div className="px-2">
        <p
          className="underline text-xxs pb-1 pt-0.5 cursor-pointer hover:text-blue-500"
          onClick={() => setIsDialogOpen(!isDialogOpen)}
        >
          Cannot complete this chore?
        </p>
        {isDialogOpen && canSkip && (
          <p
            className="underline text-xxs pb-1 pt-0.5 cursor-pointer hover:text-blue-500"
            onClick={skip}
          >
            Skip chore
          </p>
        )}
        {isDialogOpen && !canSkip && (
          <p className="text-xxs pb-1 pt-0.5">
            You can skip this chore in {getTimeToChore()}
          </p>
        )}
      </div>
    );
  };

  return (
    <CloseButtonPanel
      title={
        isTaskComplete ? (
          <div className="flex justify-center">
            <p>Well done</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <p>Lend a hand?</p>
          </div>
        )
      }
      bumpkinParts={NPC_WEARABLES.hank}
      onClose={close}
    >
      <ChoreV2 skipping={isSaving && isSkipping} />

      {!(isSaving && isSkipping) && !!chore && Content()}
    </CloseButtonPanel>
  );
};
