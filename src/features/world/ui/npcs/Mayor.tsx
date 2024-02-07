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
import { SUNNYSIDE } from "assets/sunnyside";
import { formatDateTime } from "lib/utils/time";
import { Label } from "components/ui/Label";
import debounce from "lodash.debounce";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
const network = CONFIG.NETWORK as "mainnet" | "mumbai";

const NAME_START_DATE =
  network === "mumbai" ? new Date(0) : new Date("2023-12-11T00:00:00.000Z");
const NAME_END_DATE = new Date("2023-12-16T00:00:00.000Z");
const MAX_FARM_ID = 250000;

const WHITELISTED_FARM_IDS = [
  39488, 53865, 4280, 201, 69166, 168, 27776, 3903, 13, 1336, 9609, 128727,
  86190, 201, 8084, 21637, 1, 2, 3, 39488, 1011, 45, 130170, 29, 56, 73795,
  21303, 51, 7841, 2253, 1451, 6127, 86, 1791, 63, 15747, 49035, 138310, 11,
  146323, 28, 106, 373, 128295, 31878, 61992, 919, 136998, 80399, 51738, 591,
  33,
];

const farmAvailableAt = (farmId: number) => {
  const percentage = farmId / MAX_FARM_ID;

  const availableAt =
    percentage * (NAME_END_DATE.getTime() - NAME_START_DATE.getTime()) +
    NAME_START_DATE.getTime();

  const cappedAvailableAt = Math.min(availableAt, NAME_END_DATE.getTime());

  return new Date(cappedAvailableAt);
};

interface MayorProps {
  onClose: () => void;
}

export const Mayor: React.FC<MayorProps> = ({ onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [username, setUsername] = useState<string>(
    gameState.context.state.username ?? ""
  );
  const [validationState, setValidationState] = useState<string | null>(null);

  const [tab, setTab] = useState<number>(0);
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error" | "checking"
  >("idle");

  const alreadyHaveUsername = Boolean(gameState.context.state.username);
  const { t } = useAppTranslation();
  const now = new Date();
  const availableAt = farmAvailableAt(gameState.context.farmId);
  const isAvailable =
    now > availableAt ||
    WHITELISTED_FARM_IDS.includes(gameState.context.farmId);

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
    []
  );

  const applyUsername = async () => {
    setState("loading");

    const farmId = gameState.context.farmId;
    try {
      const result = await saveUsername(
        authState.context.user.rawToken as string,
        farmId,
        username as string
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
      setTab(4);
    } catch {
      setValidationState("Error saving username, please try again");
      setState("idle");
    }
  };

  return (
    <>
      {tab === 0 && (
        <Panel bumpkinParts={NPC_WEARABLES.mayor}>
          {alreadyHaveUsername ? (
            <SpeakingText
              onClose={onClose}
              message={[
                {
                  text: `Howdy ${username}! Seems like we've already met. In case you forgot, I'm the Mayor of this town!`, //Translate
                },
                {
                  text: t("mayor.plaza.changeNamePrompt"),
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
          onClose={state === "loading" || !isAvailable ? undefined : onClose}
          bumpkinParts={NPC_WEARABLES.mayor}
        >
          {isAvailable ? (
            <>
              <div className="flex flex-col items-center p-1">
                <span>{t("mayor.plaza.enterUsernamePrompt")}:</span>
                <div className="w-full py-3 relative">
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
                      const validationState = validateUsername(e.target.value);
                      setValidationState(validationState);

                      debouncedCheckUsername.cancel();

                      if (!validationState) {
                        debouncedCheckUsername(
                          authState.context.user.rawToken as string,
                          e.target.value
                        );
                      } else {
                        setState("idle");
                      }
                    }}
                  />

                  {validationState && (
                    <label className="absolute -bottom-1 right-0 text-red-500 text-[11px] font-error">
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
          ) : (
            <>
              <div className="flex flex-col gap-2 p-1">
                <span>
                  {`I'm processing usernames in order of Farm ID. You will be able
                  to choose your username from:`}
                </span>
                <Label
                  icon={SUNNYSIDE.icons.stopwatch}
                  type="info"
                  className="my-1 mx-auto"
                >
                  {formatDateTime(availableAt.toISOString())}
                </Label>
              </div>
              <Button onClick={onClose}>{t("close")}</Button>
            </>
          )}
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
                  Code of Conduct
                </a>
                . Failure to comply may result in penalties, including possible
                account suspension.
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

      {tab === 4 && (
        <CloseButtonPanel bumpkinParts={NPC_WEARABLES.mayor}>
          <div className="flex flex-col gap-2 p-1 pb-2">
            <span>
              Congratulations {username}, your paperwork is now complete. See
              you around!
            </span>
          </div>
          <Button onClick={onClose}>{t("close")}</Button>
        </CloseButtonPanel>
      )}
    </>
  );
};
