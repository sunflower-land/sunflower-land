import React, { useState, useContext } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "../../../game/components/CloseablePanel";
import { SpeakingModal } from "../../../game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { validateUsername, saveUsername } from "lib/username";

interface MayorProps {
  onClose: () => void;
}

export const Mayor: React.FC<MayorProps> = ({ onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [username, setUsername] = useState<string | undefined>(
    gameState.context.state.username
  );
  const [validationState, setValidationState] = useState<string | null>(null);

  const [tab, setTab] = useState<number>(0);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const alreadyHaveUsername = Boolean(gameState.context.state.username);

  const applyUsername = async () => {
    setState("loading");

    const farmId = gameState.context.farmId;
    await saveUsername(authState, farmId, username)
      .then(() => {
        setState("success");
        gameService.send("SAVE");
      })
      .catch(() => setState("error"));
  };

  return (
    <>
      <Modal show={true} onHide={onClose} centered>
        {tab === 0 && (
          <>
            {alreadyHaveUsername ? (
              <SpeakingModal
                onClose={onClose}
                bumpkinParts={NPC_WEARABLES.mayor}
                message={[
                  {
                    text: `Howdy ${username}! Seems like we've already met. In case you forgot, I'm the Mayor of this town!`,
                  },
                  {
                    text: "You might want to ask other people around to call you with another name? Unfortunately, I can't do that for you now, the paperwork is too much for me to handle..",
                  },
                ]}
              />
            ) : (
              <SpeakingModal
                onClose={onClose}
                bumpkinParts={NPC_WEARABLES.mayor}
                message={[
                  {
                    text: "Howdy fellow Bumpkin I.. Don't seem to know yet? Let's meet!",
                  },
                  {
                    text: "I'm the Mayor of this town! I'm in charge of making sure everyone is happy and has a place to live. I also make sure that everyone has a name!",
                  },
                  {
                    text: "You don't have a name yet? Well, we can fix that! Do you want me to get the papers ready?",
                    actions: [
                      {
                        text: "Yes please!",
                        cb: () => {
                          setTab(1);
                        },
                      },
                      {
                        text: "No thanks.",
                        cb: () => {
                          onClose();
                        },
                      },
                    ],
                  },
                ]}
              />
            )}
          </>
        )}

        {tab === 1 && (
          <CloseButtonPanel onClose={onClose}>
            <div className="flex flex-col items-center">
              <span>Enter your username:</span>
              <input
                type="string"
                name="Username"
                autoComplete="off"
                className={
                  "text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2 m-2 text-center " +
                  (validationState ? "" : "border-2 border-red-500")
                }
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setValidationState(validateUsername(e.target.value));
                }}
              />
              {validationState && (
                <label className="text-xs mb-2 mr-2 text-red-500 text-right w-full">
                  {validationState}
                </label>
              )}
              <Button
                className="overflow-hidden"
                type="submit"
                onClick={() => {
                  if (state !== "idle") return;

                  applyUsername();
                }}
                disabled={Boolean(validationState) || state !== "idle"}
              >
                {state === "idle"
                  ? "Submit"
                  : state === "loading"
                  ? "Loading..."
                  : state === "success"
                  ? "Success!"
                  : state === "error"
                  ? "Error!"
                  : "Submit"}
              </Button>
              <div className="flex flex-row justify-end items-center w-full px-1 pt-1">
                <span
                  className="cursor-pointer text-xs underline hover:text-gray-400"
                  onClick={() => {
                    window.open("https://docs.sunflower-land.com/", "_blank");
                  }}
                >
                  Learn More
                </span>
              </div>
            </div>
          </CloseButtonPanel>
        )}

        {tab === 2 && (
          <SpeakingModal
            onClose={onClose}
            bumpkinParts={NPC_WEARABLES.mayor}
            message={[
              {
                text: `Nice to meet you ${username}!`,
              },
              {
                text: "I hope you enjoy your stay in Sunflower Land! If you ever need me again, just come back to me!",
              },
            ]}
          />
        )}
      </Modal>
    </>
  );
};
