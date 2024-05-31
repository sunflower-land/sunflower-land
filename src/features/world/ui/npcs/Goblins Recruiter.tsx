import React, { useState, useContext } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "../../../game/components/CloseablePanel";
import {
  SpeakingModal,
  SpeakingText,
} from "../../../game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { FactionName } from "features/game/types/game";

interface MayorProps {
  onClose: () => void;
  faction: FactionName;
}

export const GoblinsRecruiter: React.FC<MayorProps> = ({
  onClose,
  faction,
}) => {
  const { authService } = useContext(AuthProvider.Context);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [tab, setTab] = useState<number>(0);
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error" | "checking"
  >("idle");

  const alreadyHaveFaction = Boolean(gameState.context.state.faction?.name);
  const { t } = useAppTranslation();

  const applyUsername = async () => {
    setState("loading");
  };

  enum Faction {
    "goblins" = "goblins recruiter",
    "sunflorians" = "sunflorians recruiter",
    "bumpkins" = "bumpkins recruiter",
    "nightshades" = "nightshades recruiter",
  }

  return (
    <>
      {tab === 0 && (
        <Panel bumpkinParts={NPC_WEARABLES[Faction[faction]]}>
          {alreadyHaveFaction ? (
            <SpeakingText
              onClose={onClose}
              message={[
                {
                  text: `You already have a faction!`,
                },
              ]}
            />
          ) : (
            <SpeakingText
              onClose={onClose}
              message={[
                {
                  text: t("mayor.plaza.intro"),
                },
                {
                  text: t("mayor.plaza.role"),
                },
                {
                  text: `You need to choose a faction to join. Would you like to join the Goblins?`,
                  actions: [
                    {
                      text: t("no.thanks"),
                      cb: () => {
                        onClose();
                      },
                    },
                    {
                      text: t("yes.please"),
                      cb: () => {
                        setTab(1);
                      },
                    },
                  ],
                },
              ]}
            />
          )}
        </Panel>
      )}

      {tab === 2 && (
        <CloseButtonPanel
          onClose={onClose}
          bumpkinParts={{
            ...NPC_WEARABLES.mayor,
            body: "Light Brown Worried Farmer Potion",
          }}
          onBack={() => setTab(1)}
          title="Beware!"
        >
          <>
            <div className="flex flex-col space-y-2 px-1 pb-2 pt-0">
              <span>
                {t("mayor.plaza.usernameValidation")}{" "}
                <a
                  className="cursor-pointer underline hover:text-gray-400"
                  href="https://docs.sunflower-land.com/support/terms-of-service/code-of-conduct"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("mayor.codeOfConduct")}
                </a>
                {"."} {t("mayor.failureToComply")}
                {""}
              </span>
            </div>

            <Button
              onClick={() => {
                applyUsername();
                setTab(1);
              }}
            >
              {t("confirm")}
            </Button>
          </>
        </CloseButtonPanel>
      )}

      {tab === 3 && (
        <SpeakingModal
          onClose={onClose}
          bumpkinParts={NPC_WEARABLES.mayor}
          message={[
            {
              text: t("mayor.plaza.niceToMeetYou"), //`Nice to meet you ${username}!`,
            },
            {
              text: t("mayor.plaza.enjoyYourStay"), //"I hope you enjoy your stay in Sunflower Land! If you ever need me again, just come back to me!",
            },
          ]}
        />
      )}
    </>
  );
};
