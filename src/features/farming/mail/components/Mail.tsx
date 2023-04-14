import { useActor } from "@xstate/react";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import {
  CONVERSATIONS,
  ConversationName,
} from "features/game/types/conversations";
import npc from "assets/npcs/still_example.png";
import React, { useContext, useState } from "react";
import { Conversation } from "./Conversation";
import { SUNNYSIDE } from "assets/sunnyside";

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

  return (
    <div>
      {read.map((id) => {
        const details = CONVERSATIONS[id];

        return (
          <OuterPanel
            onClick={() => setSelected(id)}
            className="flex cursor-pointer hover:bg-brown-200"
          >
            <img src={npc} className="h-10 mr-2" />
            <div>
              <p>{details.headline}</p>
              <p className="text-xs capitalize">{details.from}</p>
            </div>
          </OuterPanel>
        );
      })}
    </div>
  );
};
