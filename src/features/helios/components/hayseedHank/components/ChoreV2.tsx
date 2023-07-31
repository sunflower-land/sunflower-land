import { useActor } from "@xstate/react";
import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";

import { getKeys } from "features/game/types/craftables";
import { DailyChore } from "./DailyChore";

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

  // const start = () => {
  //   gameService.send("chore.started");
  // };

  // if (skipping) return <Loading text="Skipping" />;

  // if (chore.bumpkinId !== bumpkin.id) {
  //   return (
  //     <>
  //       <div className="p-2 text-sm">
  //         <p>{`You aren't the same Bumpkin I last spoke with!`}</p>
  //       </div>
  //       <Button onClick={start}>Restart Chores</Button>
  //     </>
  //   );
  // }

  return (
    <>
      {getKeys(chores.chores).map((choreId) => {
        const chore = chores.chores[choreId];

        // Use createdAt key, so a skip will render a new chore
        return <DailyChore chore={chore} id={choreId} key={chore.createdAt} />;
      })}
    </>
  );
};
