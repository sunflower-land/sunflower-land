import { Panel } from "components/ui/Panel";
import React, { useState } from "react";

import chatIcon from "assets/icons/expression_chat.png";
import heartIcon from "assets/icons/heart.png";
import backIcon from "assets/icons/arrow_left.png";
import { ChatText } from "./ChatText";
import { ChatReactions } from "./ChatReactions";
import { GameState } from "features/game/types/game";
import { ReactionName } from "../lib/reactions";

interface Props {
  game: GameState;
  onMessage: (content: { text?: string; reaction?: ReactionName }) => void;
}
export const ChatUI: React.FC<Props> = ({ onMessage, game }) => {
  const [tab, setTab] = useState<"text" | "reactions">("text");

  return (
    <div
      className="w-full flex justify-center fixed bottom-4 pl-2 md:pr-2 pr-20"
      style={{ zIndex: 999 }}
      onClick={() => console.log("parent clicked")}
    >
      <Panel className="md:w-1/2 w-full h-full">
        <div className="flex justify-between">
          {tab === "text" && (
            <>
              <div className="flex items-center">
                <img src={chatIcon} className="h-6 mr-2" />
                <span className="text-sm">Chat</span>
              </div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setTab("reactions")}
              >
                <span className="text-xs underline">Reactions</span>
                <img src={heartIcon} className="h-4 ml-2" />
              </div>
            </>
          )}

          {tab === "reactions" && (
            <>
              <div className="flex items-center">
                <img src={heartIcon} className="h-6 mr-2" />
                <span className="text-sm">Reactions</span>
              </div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setTab("text")}
              >
                <img src={backIcon} className="h-4 mr-2" />
                <span className="text-xs underline">Back</span>
              </div>
            </>
          )}
        </div>

        {tab === "text" && (
          <ChatText onMessage={(text) => onMessage({ text })} />
        )}
        {tab === "reactions" && (
          <ChatReactions
            onReact={(reaction) => onMessage({ reaction })}
            game={game}
          />
        )}
      </Panel>
    </div>
  );
};
