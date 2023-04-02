import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { hasShownTutorial } from "lib/tutorial";
import { Bumpkin } from "features/game/types/game";
import { isTaskComplete } from "./lib/HayseedHankTask";
import { CONVERSATIONS } from "features/game/types/conversations";
import { Panel } from "components/ui/Panel";
import { Conversation } from "features/farming/mail/components/Conversation";
import { Chore } from "./components/Chore";

interface Props {
  x: number;
  y: number;
}

export const HayseedHank: React.FC<Props> = ({ x, y }) => {
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
    <MapPlacement x={7} y={0} height={1} width={1}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={handleClick}
      >
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            left: `${PIXEL_SCALE * 0}px`,
            bottom: `${PIXEL_SCALE * 28}px`,
            transform: "scaleX(-1)",
          }}
        >
          <NPC
            body="Light Brown Farmer Potion"
            shirt="Red Farmer Shirt"
            pants="Brown Suspenders"
            hair="Sun Spots"
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
              className="absolute animate-float"
              style={{
                width: `${PIXEL_SCALE * 4}px`,
                bottom: `${PIXEL_SCALE * -3}px`,
                left: `${PIXEL_SCALE * 7}px`,
              }}
            />
          )}
        </div>
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
            bumpkinParts={{
              body: "Light Brown Farmer Potion",
              shirt: "Red Farmer Shirt",
              pants: "Brown Suspenders",
              hair: "Sun Spots",
              tool: "Farmer Pitchfork",
            }}
            onClose={() => setIsOpen(false)}
          >
            <Chore onClose={() => setIsOpen(false)} />
          </CloseButtonPanel>
        )}
      </Modal>
    </MapPlacement>
  );
};
