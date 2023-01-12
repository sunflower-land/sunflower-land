import { Panel } from "components/ui/Panel";
import React, { useState } from "react";

import chatIcon from "assets/icons/expression_chat.png";
import heartIcon from "assets/icons/heart.png";
import backIcon from "assets/icons/arrow_left.png";
import disc from "assets/icons/disc.png";
import { ChatText } from "./ChatText";
import { ChatReactions } from "./ChatReactions";
import { ReactionName } from "./lib/reactions";
import { GameState } from "features/game/types/game";

interface Props {
  game: GameState;
  onMessage: (content: { text?: string; reaction?: ReactionName }) => void;
}
export const ChatUI: React.FC<Props> = ({ onMessage, game }) => {
  const [tab, setTab] = useState<"text" | "reactions">("reactions");

  return (
    <div
      className="w-full flex justify-center fixed bottom-4 pl-2 md:pr-2 pr-20"
      style={{ zIndex: 999, height: "125px" }}
      onClick={() => console.log("parent clicked")}
    >
      <Panel className="md:w-1/2 w-full">
        <div className="flex justify-between">
          {tab === "text" && (
            <>
              <div className="flex items-center">
                <img src={chatIcon} className="h-6 mr-2" />
                <span className="text-sm">Bumpkin chat</span>
              </div>
              <div
                className="flex items-center"
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
              <div className="flex items-center" onClick={() => setTab("text")}>
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
