import { useActor } from "@xstate/react";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import {
  CONVERSATIONS,
  ConversationName,
} from "features/game/types/conversations";
import React, { useContext, useState } from "react";
import { Conversation } from "./Conversation";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPCFixed } from "features/island/bumpkin/components/DynamicMiniNFT";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Mail: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [selected, setSelected] = useState<ConversationName>();

  const read = gameState.context.state.mailbox.read;

  if (read.length === 0) {
    return <p>No mail</p>;
  }

  if (selected) {
    const details = CONVERSATIONS[selected];
    return (
      <>
        <div className="flex items-center mb-1">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="h-6 mr-2 cursor-pointer"
            onClick={() => setSelected(undefined)}
          />
          <p className="text-sm capitalize ml-1 underline">{details.from}</p>
        </div>

        <Conversation conversationId={selected} read />
      </>
    );
  }
  console.log("Mail");

  return (
    <div>
      {read.map((id) => {
        const details = CONVERSATIONS[id];

        return (
          <OuterPanel
            key={id}
            onClick={() => setSelected(id)}
            className="flex cursor-pointer hover:bg-brown-200 mb-1"
          >
            <div className="h-10 mr-2">
              <NPCFixed
                width={PIXEL_SCALE * 16}
                {...NPC_WEARABLES[details.from as NPCName]}
              />
            </div>
            <div>
              <p className="text-sm">{details.headline}</p>
              <p className="text-xs capitalize underline">{details.from}</p>
            </div>
          </OuterPanel>
        );
      })}
    </div>
  );
};
