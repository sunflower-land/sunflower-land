import React, { useState, useContext, useCallback, useEffect } from "react";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "../../../game/components/CloseablePanel";
import {
  SpeakingModal,
  SpeakingText,
} from "../../../game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { validateUsername, checkUsername } from "lib/username";
import { Panel } from "components/ui/Panel";
import debounce from "lodash.debounce";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { gameAnalytics } from "lib/gameAnalytics";

const COOLDOWN = 1000 * 60 * 60 * 24 * 30; // 30 days
const gemCost = 250;

interface MayorProps {
  onClose: () => void;
}

export const Mayor: React.FC<MayorProps> = ({ onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const currentUsername = useSelector(
    gameService,
    (state) => state.context.state.username,
  );
  const usernameChangeSuccess = useSelector(gameService, (state) =>
    state.matches("changingUsernameSuccess"),
  );
  const usernameChangeFailed = useSelector(gameService, (state) =>
    state.matches("changingUsernameFailed"),
  );

  const lastChangeAt = useSelector(
    gameService,
    (state) => state.context.state.settings.username?.setAt ?? 0,
  );
  const hasEnoughGems = useSelector(gameService, (state) => {
    const inventory = state.context.state.inventory;
    return inventory.Gem?.gte(gemCost) ?? false;
  });

  const [username, setUsername] = useState<string>();
  const [validationState, setValidationState] = useState<string | null>(null);

  const [tab, setTab] = useState<number>(0);
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error" | "checking"
  >("idle");

  const alreadyHaveUsername = !!currentUsername;
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
    setTab(1);
    setState("loading");
    try {
      gameService.send("username.changed", {
        effect: { type: "username.changed", username: username as string },
        authToken: authState.context.user.rawToken as string,
      });
      gameService.send({
        type: "UPDATE_USERNAME",
        username: username as string,
      });
      gameAnalytics.trackSink({
        currency: "Gem",
        amount: gemCost,
        type: "Fee",
        item: "Username Change",
      });
    } catch {
      setValidationState("Error saving username, please try again");
      setState("idle");
    }
  };

  useEffect(() => {
    if (usernameChangeSuccess) {
      setState("success");
      setTab(4);
    }
  }, [usernameChangeSuccess]);

  useEffect(() => {
    if (usernameChangeFailed) {
      setState("error");
    }
  }, [usernameChangeFailed]);

  const isOnCooldown = Date.now() - lastChangeAt < COOLDOWN;
  const daysToNextChange = Math.ceil(
    (COOLDOWN - (Date.now() - lastChangeAt)) / (1000 * 60 * 60 * 24),
  );

  return (
    <>
      {tab === 0 && (
        <Panel bumpkinParts={NPC_WEARABLES.mayor}>
          {alreadyHaveUsername ? (
            <SpeakingText
              onClose={onClose}
              message={[
                {
                  text: t("mayor.plaza.alreadyMet", {
                    username: currentUsername,
                  }),
                },
                ...(isOnCooldown
                  ? [
                      {
                        text: t("mayor.plaza.usernameChangedRecently"),
                      },
                      {
                        text: t("mayor.plaza.cooldown", {
                          days: daysToNextChange,
                        }),
                      },
                    ]
                  : [
                      {
                        text: t("mayor.plaza.changeNamePrompt"),
                        actions: [
                          {
                            text: t("no.thanks"),
                            cb: onClose,
                          },
                          {
                            text: t("yes.please"),
                            cb: () => setTab(1),
                          },
                        ],
                      },
                    ]),
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

      {tab === 1 && (
        <CloseButtonPanel
          onClose={state === "loading" ? undefined : onClose}
          bumpkinParts={NPC_WEARABLES.mayor}
        >
          <>
            <div className="flex flex-col items-center p-1">
              <span>{t("mayor.plaza.enterUsernamePrompt")}</span>
              <div className="flex flex-col gap-2 w-full mt-3">
                <input
                  type="string"
                  name="Username"
                  autoComplete="off"
                  className={
                    "text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2 text-center"
                  }
                  value={username}
                  onChange={(e) => {
                    setState("checking");
                    setUsername(e.target.value);
                    const validationState = validateUsername(
                      e.target.value,
                      currentUsername,
                    );
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

                <div className="flex flex-row justify-between gap-2">
                  <Label
                    type={"info"}
                    icon={ITEM_DETAILS.Gem.image}
                    className="text-xs"
                  >
                    {`${gemCost} Gems`}
                  </Label>
                  {!hasEnoughGems && (
                    <Label type="danger" className="text-xs">
                      {t("mayor.plaza.notEnoughGems")}
                    </Label>
                  )}
                  {hasEnoughGems && validationState && (
                    <Label type="danger" className="text-xs">
                      {validationState}
                    </Label>
                  )}
                </div>
              </div>
            </div>
            <Button
              className="overflow-hidden"
              type="submit"
              onClick={state !== "idle" ? undefined : () => setTab(2)}
              disabled={
                Boolean(validationState) ||
                state !== "idle" ||
                !username ||
                !hasEnoughGems
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
        </CloseButtonPanel>
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

            <Button onClick={applyUsername}>{t("confirm")}</Button>
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

      {tab === 4 && (
        <CloseButtonPanel bumpkinParts={NPC_WEARABLES.mayor}>
          <div className="flex flex-col gap-2 p-1 pb-2">
            <span>
              {t("mayor.paperworkComplete", {
                username: currentUsername ?? "",
              })}
            </span>
          </div>
          <Button
            onClick={() => {
              onClose();
              gameService.send({ type: "CONTINUE" });
            }}
          >
            {t("close")}
          </Button>
        </CloseButtonPanel>
      )}
    </>
  );
};
