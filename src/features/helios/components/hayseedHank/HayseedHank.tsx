import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Bumpkin } from "features/game/types/game";
import { isTaskComplete } from "./lib/HayseedHankTask";
import { CONVERSATIONS } from "features/game/types/conversations";
import { Panel } from "components/ui/Panel";
import { Conversation } from "features/farming/mail/components/Conversation";
import { Chore } from "./components/Chore";
import { NPC_WEARABLES } from "lib/npcs";

export const HayseedHank: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    // Trigger an autosave in case they have changes so user can sync right away
    gameService.send("SAVE");

    setIsOpen(true);
  };

  const hayseedHank = gameState.context.state.hayseedHank;
  const bumpkin = gameState.context.state.bumpkin as Bumpkin;

  const conversationId = gameState.context.state.conversations.find(
    (id) => CONVERSATIONS[id].from === "hank"
  );

  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          right: `${PIXEL_SCALE * 2}px`,
          bottom: `${PIXEL_SCALE * 32}px`,
          transform: "scaleX(-1)",
        }}
      >
        <NPC
          body="Light Brown Farmer Potion"
          shirt="Red Farmer Shirt"
          pants="Brown Suspenders"
          hair="Sun Spots"
          onClick={handleClick}
        />
        {conversationId && (
          <img
            src={SUNNYSIDE.icons.expression_chat}
            className="absolute animate-pulsate"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              top: `${PIXEL_SCALE * -4}px`,
              right: `${PIXEL_SCALE * 1}px`,
            }}
          />
        )}
        {isTaskComplete(hayseedHank, bumpkin) && (
          <img
            src={SUNNYSIDE.icons.confirm}
            className="absolute img-highlight-heavy"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              bottom: `${PIXEL_SCALE * -7}px`,
              left: `${PIXEL_SCALE * 3.5}px`,
              transform: "scaleX(-1)",
            }}
          />
        )}
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        {conversationId ? (
          <Panel
            bumpkinParts={{
              body: "Light Brown Farmer Potion",
              shirt: "Red Farmer Shirt",
              pants: "Brown Suspenders",
              hair: "Sun Spots",
              tool: "Farmer Pitchfork",
            }}
          >
            <Conversation conversationId={conversationId} />
          </Panel>
        ) : (
          <CloseButtonPanel
            title={"Ready to work?"}
            bumpkinParts={NPC_WEARABLES.hank}
            onClose={() => setIsOpen(false)}
          >
            <Chore onClose={() => setIsOpen(false)} />
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
