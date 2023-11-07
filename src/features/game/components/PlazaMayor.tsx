import React, { useState } from "react";
import { GameState } from "../types/game";

import { Button } from "components/ui/Button";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "./CloseablePanel";
import { SpeakingModal } from "./SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";

interface PlazaMayorProps {
  onClose: () => void;
  gameState: GameState;
}

export const PlazaMayor: React.FC<PlazaMayorProps> = ({
  onClose,
  gameState,
}) => {
  console.log("gameState ", gameState);

  const [tab, setTab] = useState(0);
  const alreadyHaveUsername =
    gameState.username && gameState.username.length > 0;

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
                    text: `Howdy ${gameState?.username}! Seems like we've already met. In case you forgot, I'm the Mayor of this town!`,
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
              <span>Enter your name:</span>
              <input
                type="string"
                name="Username"
                className="text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2 m-2 text-center"
              />
              <Button
                className="overflow-hidden"
                type="submit"
                onClick={() => {
                  setTab(2);
                }}
              >
                Submit
              </Button>
            </div>
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
