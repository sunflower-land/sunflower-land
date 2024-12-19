import React, { useState, useContext, useCallback } from "react";
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
import { validateUsername, saveUsername, checkUsername } from "lib/username";
import { Panel } from "components/ui/Panel";
import debounce from "lodash.debounce";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { capitalize } from "lib/utils/capitalize";
import { hasOrderRequirements } from "features/island/delivery/components/Orders";
import { InlineDialogue } from "../TypingMessage";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { Label } from "components/ui/Label";

interface MayorProps {
  isIntroducing: boolean;
  onClose: () => void;
}

export const Mayor: React.FC<MayorProps> = ({ isIntroducing, onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const usernameOnEnter = gameService.getSnapshot().context.state.username;

  const [username, setUsername] = useState<string>(
    gameState.context.state.username ?? "",
  );
  const [validationState, setValidationState] = useState<string | null>(null);

  const [tab, setTab] = useState<number>(!usernameOnEnter ? 0 : 4);
  const [showNPCFind, setShowNPCFind] = useState(false);
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error" | "checking"
  >("idle");

  const alreadyHaveUsername = Boolean(gameState.context.state.username);
  const { t } = useAppTranslation();

  // debounced function to check if username is available
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckUsername = useCallback(
    debounce(async (token: string, username: string) => {
      try {
        const result = await checkUsername(token, username);
        setValidationState(result.success ? null : "Username already taken");
      } catch {
        setValidationState("Error checking username, please try again");
      } finally {
        setState("idle");
      }
    }, 300),
    [],
  );

  const applyUsername = async () => {
    setState("loading");

    const farmId = gameState.context.farmId;
    try {
      const result = await saveUsername(
        authState.context.user.rawToken as string,
        farmId,
        username as string,
      );
      if (result.success === false) {
        setValidationState("Username already taken");
        setState("idle");
        return;
      }

      gameService.send({
        type: "UPDATE_USERNAME",
        username: username as string,
      });
      setState("success");
      setTab(3);
    } catch {
      setValidationState("Error saving username, please try again");
      setState("idle");
    }
  };

  // Find a delivery that is ready
  const delivery = gameState.context.state.delivery.orders.find((order) =>
    hasOrderRequirements({
      order,
      state: gameState.context.state,
    }),
  );

  if (showNPCFind && delivery) {
    return (
      <Panel bumpkinParts={NPC_WEARABLES.mayor}>
        <div className="flex flex-col justify-between">
          <div className="p-1">
            <Label type={"default"} className="capitalize mb-1">{`${t(
              "world.intro.find",
            )} ${delivery.from}`}</Label>
            <InlineDialogue
              message={t("world.intro.findNPC", {
                name: capitalize(delivery.from),
              })}
            />
            <div className="relative mt-2 mb-2 mr-0.5 -ml-1">
              <NPCIcon parts={NPC_WEARABLES[delivery.from]} />
            </div>
          </div>
          <Button onClick={onClose}>{t("ok")}</Button>
        </div>
      </Panel>
    );
  }

  // If you don't have a username then return the next step
  // If they do have a username then start the second step

  return (
    <>
      {tab === 0 && (
        <Panel bumpkinParts={NPC_WEARABLES.mayor}>
          {alreadyHaveUsername && !isIntroducing ? (
            <SpeakingText
              onClose={onClose}
              message={[
                {
                  text: t("mayor.plaza.metBefore", {
                    username,
                  }),
                },
                {
                  text: t("mayor.plaza.coffee"),
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
                  text: t("mayor.plaza.fixNamePrompt"),
                  actions: [
                    {
                      text: t("ok"),
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

      {tab === 1 && (
        <Panel bumpkinParts={NPC_WEARABLES.mayor}>
          <>
            <div className="flex flex-col items-center p-1">
              <span>{t("mayor.plaza.enterUsernamePrompt")}</span>
              <div className="w-full py-3 relative">
                <input
                  type="string"
                  name="Username"
                  autoComplete="off"
                  className={
                    "text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2 my-1.5 text-center"
                  }
                  value={username}
                  onChange={(e) => {
                    setState("checking");
                    setUsername(e.target.value);
                    const validationState = validateUsername(e.target.value);
                    setValidationState(validationState);

                    debouncedCheckUsername.cancel();

                    if (!validationState) {
                      debouncedCheckUsername(
                        authState.context.user.rawToken as string,
                        e.target.value,
                      );
                    } else {
                      setState("idle");
                    }
                  }}
                />

                {validationState && (
                  <label className="absolute -bottom-1 right-0 text-black text-[11px] font-error">
                    {validationState}
                  </label>
                )}
              </div>
            </div>
            <Button
              className="overflow-hidden"
              type="submit"
              onClick={state !== "idle" ? undefined : () => setTab(2)}
              disabled={
                Boolean(validationState) || state !== "idle" || !username
              }
            >
              {state === "idle"
                ? t("submit")
                : state === "loading"
                  ? t("submitting")
                  : state === "success"
                    ? t("success")
                    : state === "error"
                      ? t("error")
                      : state === "checking"
                        ? "Checking availability..."
                        : t("submit")}
            </Button>
          </>
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
            <div className="flex flex-col space-y-2 px-1 pb-2 pt-0 mb-2">
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
              text: t("mayor.plaza.congratulations", { username }),
              actions: [
                {
                  text: t("ok"),
                  cb: () => {
                    // If mmo_introduction.read is set then go into the move state machine to joined
                    // else set next tab
                    setTab(4);
                  },
                },
              ],
            },
          ]}
        />
      )}
      {tab === 4 && (
        <SpeakingModal
          onClose={delivery ? () => setShowNPCFind(true) : () => onClose()}
          bumpkinParts={NPC_WEARABLES.mayor}
          message={[
            // If they haven't completed their first delivery then go into the next step
            ...(!usernameOnEnter
              ? [
                  {
                    text: t("mayor.plaza.businessDone"),
                  },
                ]
              : [
                  {
                    text: t("mayor.plaza.role"),
                  },
                ]),

            {
              text: t("mayor.plaza.welcome"),
            },
            {
              text: delivery
                ? t("world.intro.delivery")
                : t("world.intro.missingDelivery"),
            },
          ]}
        />
      )}
    </>
  );
};
