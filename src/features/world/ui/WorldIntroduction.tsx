import React, { useState, useContext, useCallback, useEffect } from "react";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import {
  SpeakingModal,
  SpeakingText,
} from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { validateUsername, checkUsername } from "lib/username";
import { Panel } from "components/ui/Panel";
import debounce from "lodash.debounce";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { capitalize } from "lib/utils/capitalize";
import { hasOrderRequirements } from "features/island/delivery/components/Orders";

import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { Label } from "components/ui/Label";
import { InlineDialogue } from "./TypingMessage";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface WorldIntroductionProps {
  onClose: (username: string) => void;
}

export const WorldIntroduction: React.FC<WorldIntroductionProps> = ({
  onClose,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const currentUsername = useSelector(
    gameService,
    (state) => state.context.state.username,
  );

  const usernameAssignmentSuccess = useSelector(gameService, (state) =>
    state.matches("assigningUsernameSuccess"),
  );
  const usernameAssignmentFailed = useSelector(gameService, (state) =>
    state.matches("assigningUsernameFailed"),
  );

  // Find a delivery that is ready
  const delivery = useSelector(gameService, (state) =>
    state.context.state.delivery.orders.find((order) =>
      hasOrderRequirements({
        order,
        state: state.context.state,
      }),
    ),
  );

  // If a player goes through the name set up they see an intro at the beginning.
  // If for some reason a player gets into the introduction state (cleared local storage)
  // but they already have a name, they won't see the intro so we need to check for that so we can show it.
  const [showMayorIntroStatement, setShowMayorIntroStatement] = useState(true);
  const [showNameSetUpStatement, setShowNameSetUpStatement] = useState(false);
  const [username, setUsername] = useState<string>();
  const [validationState, setValidationState] = useState<string | null>(null);

  const [tab, setTab] = useState<number>(!username ? 0 : 4);
  const [showNPCFind, setShowNPCFind] = useState(false);
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error" | "checking"
  >("idle");

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
      gameService.send("username.assigned", {
        effect: { type: "username.assigned", username: username as string },
        authToken: authState.context.user.rawToken as string,
      });
      gameService.send({
        type: "UPDATE_USERNAME",
        username: username as string,
      });
    } catch {
      setValidationState("Error saving username, please try again");
      setState("idle");
    }
  };

  useEffect(() => {
    if (usernameAssignmentSuccess) {
      setTab(3);
      setState("success");

      // Move out of that state
      gameService.send({ type: "CONTINUE" });
    }
  }, [usernameAssignmentSuccess]);

  useEffect(() => {
    if (usernameAssignmentFailed) {
      setState("error");

      // Move out of that state
      gameService.send({ type: "CONTINUE" });
    }
  }, [usernameAssignmentFailed]);

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
          <Button onClick={() => onClose(currentUsername ?? "")}>
            {t("ok")}
          </Button>
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
          <SpeakingText
            onClose={() => onClose(currentUsername ?? "")}
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
        </Panel>
      )}

      {tab === 1 && (
        <Panel bumpkinParts={NPC_WEARABLES.mayor}>
          <>
            <div className="flex flex-col items-center p-1">
              <span>{t("mayor.plaza.enterUsernamePrompt")}</span>
              <div className="flex flex-col gap-2 w-full my-3">
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

                {validationState && (
                  <Label type="danger" className="text-xs">
                    {validationState}
                  </Label>
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
          onClose={() => onClose(currentUsername ?? "")}
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

            <Button onClick={applyUsername}>{t("confirm")}</Button>
          </>
        </CloseButtonPanel>
      )}

      {tab === 3 && (
        <SpeakingModal
          onClose={() => onClose(currentUsername ?? "")}
          bumpkinParts={NPC_WEARABLES.mayor}
          message={[
            {
              text: t("mayor.plaza.congratulations", {
                username: currentUsername ?? "",
              }),
              actions: [
                {
                  text: t("ok"),
                  cb: () => {
                    setTab(4);
                    setShowNameSetUpStatement(true);
                    setShowMayorIntroStatement(false);
                  },
                },
              ],
            },
          ]}
        />
      )}
      {tab === 4 && (
        <SpeakingModal
          onClose={
            delivery
              ? () => setShowNPCFind(true)
              : () => onClose(currentUsername ?? "")
          }
          bumpkinParts={NPC_WEARABLES.mayor}
          message={[
            // If they haven't completed their first delivery then go into the next step
            ...(showNameSetUpStatement
              ? [
                  {
                    text: t("mayor.plaza.businessDone"),
                  },
                ]
              : []),
            {
              text: `${showMayorIntroStatement ? t("mayor.plaza.shortIntro") : ""}${t("mayor.plaza.welcome")}`,
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
