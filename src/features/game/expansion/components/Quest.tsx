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
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Loading } from "features/auth/components";
import { Panel } from "components/ui/Panel";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";
import { Minting } from "features/game/components/Minting";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const questService = useInterpret(questMachine, {
    context: {
      quests,
      bumpkinId: gameState.context.state.bumpkin?.id as number,
      jwt: authState.context.user.rawToken,
      farmId: gameState.context.farmId,
    },
  }) as unknown as MachineInterpreter;

  const [state, send] = useActor(questService);
  const quest = QUESTS[state.context.currentQuest as QuestName];

  if (state.matches("loading")) {
    return (
      <Panel>
        <Loading />
      </Panel>
    );
  }

  if (state.matches("error")) {
    return (
      <Panel>
        <SomethingWentWrong />
      </Panel>
    );
  }

  if (state.matches("minting")) {
    return (
      <Panel>
        <Minting />
      </Panel>
    );
  }

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
          <Button onClick={() => send("CONTINUE")}>{t("continue")}</Button>
        </>
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
        <>
          <div className="p-2 flex flex-col items-center">
            <img
              src={getImageUrl(ITEM_IDS[quest.wearable])}
              className="w-1/3 my-2 rounded-lg"
            />
            <p className="text-sm mb-3">
              {t("quest.congrats", { wearable: quest.wearable })}
            </p>
            <p className="text-sm mb-3">{t("quest.equipWearable")}</p>
          </div>
          <Button onClick={() => send("CONTINUE")}>{t("continue")}</Button>
        </>
      );
    }

    return null;
  };

  return (
    <CloseButtonPanel
      title={state.matches("idle") ? quest.wearable : questTitle}
      bumpkinParts={bumpkinParts}
      onClose={() => close()}
    >
      {Content()}
    </CloseButtonPanel>
  );
};
