import React, { useState } from "react";
import { GameState } from "../types/game";

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
                    text: `Howdy ${gameState?.username}! Seems like we've already met. In case you forgot, I'm the Mayor of this town!`,
                  },
                  {
                    text: "You might want to ask other people around to call you with another name? Unfortunately, I can't do that for you now, the paperwork is too much for me to handle..",
                  },
                ]}
              />
            )}
          </>
        )}

        {tab === 1 && (
          <CloseButtonPanel onClose={onClose}>
            {/* <div className="text-center">
            <h1>Plaza Mayor</h1>
            <Label type="danger" icon={ITEM_DETAILS["Beta Pass"].image}>
              Beta Pass Required
            </Label>
          </div> */}
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
