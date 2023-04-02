import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import {
  CONVERSATIONS,
  ConversationName,
} from "features/game/types/conversations";
import { NPCDialogue } from "features/game/types/game";
import React, { useContext } from "react";

interface Props {
  conversationId: ConversationName;
}

const CONTENT_HEIGHT = 300;

export const Conversation: React.FC<Props> = ({ conversationId }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const acknowledge = () => {
    gameService.send({ type: "conversation.ended", id: conversationId });
  };

  const conversation = CONVERSATIONS[conversationId];

  return (
    <div>
      <div
        style={{ maxHeight: CONTENT_HEIGHT }}
        className="overflow-y-auto p-2 divide-brown-600 scrollable"
      >
        {conversation.content.map((content) => (
          <div className="mb-2">
            <p className="text-sm">{content.text}</p>
            {content.image && (
              <img
                src={content.image}
                className="w-full mx-auto rounded-md mt-1"
              />
            )}
          </div>
        ))}

        <Button onClick={acknowledge}>Got it</Button>
      </div>
    </div>
  );
};
