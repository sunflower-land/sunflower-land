import React, { useContext, useState } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { NPC_WEARABLES, acknowedlgedNPCs, acknowledgeNPC } from "lib/npcs";
import { ChoreV2 } from "./components/ChoreV2";
import { getKeys } from "features/game/types/craftables";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { ChoreV2Name } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  onClose: () => void;
}
export const HayseedHankV2: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isSkipping, setIsSkipping] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [introDone, setIntroDone] = useState(!!acknowedlgedNPCs()["hank"]);

  const { chores, bumpkin } = gameState.context.state;

  const choreKey =
    chores &&
    getKeys(chores.chores).find((key) => !chores.chores[key].completedAt);
  const chore = choreKey !== undefined ? chores?.chores[choreKey] : undefined;
  const startedAt = chore?.createdAt;

  const isSaving = gameState.matches("autosaving");

  const skip = (id: ChoreV2Name) => {
    setIsSkipping(true);
    gameService.send("chore.skipped", { id: Number(id) });
    gameService.send("SAVE");
    setIsDialogOpen(false);
    setCanSkip(false);
  };

  const close = () => {
    onClose();
    setIsSkipping(false);
    setIsDialogOpen(false);
  };

  if (!introDone) {
    return (
      <SpeakingModal
        bumpkinParts={NPC_WEARABLES["hank"]}
        message={[
          {
            text: "Well, howdy there, young whippersnappers! I'm Hayseed Hank, a seasoned ol' Bumpkin farmer, tendin' to the land like it's still the good ol' days.",
          },
          {
            text: "However, my bones ain't what they used to be. If you can help me with my daily chores, I will reward you with Crow Feathers.",
            actions: [
              {
                text: "Let's do it",
                cb: () => {
                  setIntroDone(true);
                  acknowledgeNPC("hank");
                },
              },
            ],
          },
        ]}
        onClose={onClose}
      />
    );
  }

  // const Content = () => {
  //   return (
  //     <div className="px-2">
  //       {/* <p
  //         className="underline text-xxs pb-1 pt-0.5 cursor-pointer hover:text-blue-500"
  //         onClick={() => setIsDialogOpen(!isDialogOpen)}
  //       >
  //         Cannot complete this chore?
  //       </p> */}
  //       {isDialogOpen && canSkip && (
  //         <p
  //           className="underline text-xxs pb-1 pt-0.5 cursor-pointer hover:text-blue-500"
  //           onClick={skip}
  //         >
  //           Skip chore
  //         </p>
  //       )}
  //       {isDialogOpen && !canSkip && (
  //         <p className="text-xxs pb-1 pt-0.5">
  //           You can skip this chore in {getTimeToChore()}
  //         </p>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <CloseButtonPanel
      title="Daily Chores"
      bumpkinParts={NPC_WEARABLES.hank}
      onClose={close}
    >
      <div
        style={{ maxHeight: "200px" }}
        className="overflow-y-auto p-2 divide-brown-600 scrollable"
      >
        <div className="p-1 mb-2">
          <div className="flex items-center mb-1">
            <div className="w-6">
              <img src={SUNNYSIDE.icons.timer} className="h-4 mx-auto" />
            </div>
            <span className="text-xs">New chores available in X hours.</span>
          </div>
          <div className="flex items-center ">
            <div className="w-6">
              <img src={SUNNYSIDE.icons.heart} className="h-4 mx-auto" />
            </div>
            <span className="text-xs">You can skip chores each new day.</span>
          </div>
        </div>

        <ChoreV2 skipping={isSaving && isSkipping} />
      </div>

      {/* {!(isSaving && isSkipping) && !!chore && Content()} */}
    </CloseButtonPanel>
  );
};
