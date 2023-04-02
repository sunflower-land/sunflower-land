import { useActor } from "@xstate/react";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import {
  CONVERSATIONS,
  ConversationName,
} from "features/game/types/conversations";
import React, { useContext, useState } from "react";
import { Conversation } from "./Conversation";

export const Mail: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [selected, setSelected] = useState<ConversationName>();

  const read = gameState.context.state.mailbox.read;

  if (read.length === 0) {
    return <p>No mail</p>;
  }

  if (selected) {
    return <Conversation conversationId={selected} />;
  }

  return (
    <div>
      {read.map((id) => {
        const details = CONVERSATIONS[id];

        return (
          <OuterPanel onClick={() => setSelected(id)}>
            <p>{details.headline}</p>
          </OuterPanel>
        );
      })}
    </div>
  );
};
