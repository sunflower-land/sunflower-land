import React, { ReactElement, useContext } from "react";
import { useActor } from "@xstate/react";
import { useInterpret } from "@xstate/react";

import * as AuthProvider from "features/auth/lib/Provider";
import { QuestName, QUESTS } from "features/game/types/quests";
import { Button } from "components/ui/Button";
import { QuestProgress } from "features/island/farmerQuest/components/QuestProgress";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { Equipped, ITEM_IDS } from "features/game/types/bumpkin";
import { CONFIG } from "lib/config";
import { Context } from "features/game/GameProvider";

import { MachineInterpreter, questMachine } from "../lib/quest/questMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  onClose: () => void;
  quests: QuestName[];
  questTitle: string;
  questDescription: ReactElement;
  bumpkinParts?: Partial<Equipped>;
  questCompletionScreen: ReactElement;
}

export const Quest: React.FC<Props> = ({
  onClose,
  quests,
  questTitle,
  questDescription,
  bumpkinParts,
  questCompletionScreen,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const questService = useInterpret(questMachine, {
    context: {
      quests,
      bumpkinId: gameState.context.state.bumpkin?.id as number,
      jwt: authState.context.rawToken,
      farmId: authState.context.farmId,
    },
  }) as unknown as MachineInterpreter;

  const [state, send] = useActor(questService);

  const close = () => {
    if (state.matches("loading") || state.matches("minting")) {
      return;
    }

    onClose();
  };

  const Content = () => {
    if (state.matches("introduction")) {
      return (
        <>
          <div className="p-2 flex flex-col justify-center">
            {questDescription}
          </div>
          <Button onClick={() => send("CONTINUE")}>Continue</Button>
        </>
      );
    }

    if (state.matches("loading")) {
      return (
        <div>
          <span className="loading ">Loading</span>
        </div>
      );
    }

    const quest = QUESTS[state.context.currentQuest as QuestName];

    if (state.matches("error")) {
      return (
        <div className="h-24">
          <span className="">Something went wrong!</span>
        </div>
      );
    }

    if (state.matches("complete")) {
      return questCompletionScreen;
    }

    if (state.matches("idle")) {
      return (
        <QuestProgress
          onClaim={() => send("MINT")}
          questName={state.context.currentQuest as QuestName}
          secondsLeft={
            quest.deadline
              ? Math.floor(
                  (new Date(quest.deadline).getTime() - Date.now()) / 1000
                )
              : 0
          }
        />
      );
    }

    if (state.matches("minted")) {
      const bumpkinUrl =
        CONFIG.NETWORK === "mainnet"
          ? `https://bumpkins.io/#/bumpkins/${gameState.context.state.bumpkin?.id}`
          : `https://testnet.bumpkins.io/#/bumpkins/${gameState.context.state.bumpkin?.id}`;

      return (
        <div className="p-1 flex flex-col items-center">
          <p className="mb-1">Congratulations!</p>
          <img
            src={getImageUrl(ITEM_IDS[quest.wearable])}
            className="w-1/3 my-2 rounded-lg"
          />
          <p className="text-sm mb-3">{`You minted a ${quest.wearable}`}</p>
          <p className="text-sm mb-3">
            Go to{" "}
            <a
              href={bumpkinUrl}
              target="_blank"
              className="underline"
              rel="noreferrer"
            >
              Bumpkins.io
            </a>{" "}
            to equip this item
          </p>
          <Button onClick={() => send("CONTINUE")}>Continue</Button>
        </div>
      );
    }

    return null;
  };

  if (state.matches("minting")) {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-shadow text-center loading">Minting</span>
        <img
          src={SUNNYSIDE.npcs.goblin_hammering}
          className="w-1/2 mt-2 mb-3"
        />
        <span className="text-sm">
          Please be patient while we mint the SFT for you.
        </span>
      </div>
    );
  }

  return (
    <CloseButtonPanel
      title={questTitle}
      bumpkinParts={bumpkinParts}
      onClose={() => close()}
    >
      {Content()}
    </CloseButtonPanel>

    // <Panel >
    //   <img
    //     src={SUNNYSIDE.icons.close}
    //     className="absolute cursor-pointer z-20"
    //     onClick={close}
    //     style={{
    //       top: `${PIXEL_SCALE * 6}px`,
    //       right: `${PIXEL_SCALE * 6}px`,
    //       width: `${PIXEL_SCALE * 11}px`,
    //     }}
    //   />

    // </Panel>
  );
};
