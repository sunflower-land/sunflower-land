import React, { useState } from "react";

import { ChatText } from "./ChatText";
import { ChatReactions } from "./ChatReactions";
import { GameState } from "features/game/types/game";
import { ReactionName } from "../lib/reactions";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  game: GameState;
  onMessage: (content: { text?: string; reaction?: ReactionName }) => void;
}
export const ChatUI: React.FC<Props> = ({ onMessage, game }) => {
  const [tab, setTab] = useState(0);

  return (
    <div
      className="w-full flex justify-center fixed bottom-4 pl-2 md:pr-2 pr-20"
      style={{ zIndex: 999 }}
      onClick={() => console.log("parent clicked")}
    >
      <CloseButtonPanel
        showCloseButton={false}
        tabs={[
          { icon: SUNNYSIDE.icons.expression_chat, name: "Chat" },
          { icon: SUNNYSIDE.icons.heart, name: "Reactions" },
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
      >
        {tab === 0 && <ChatText onMessage={(text) => onMessage({ text })} />}
        {tab === 1 && (
          <ChatReactions
            onReact={(reaction) => onMessage({ reaction })}
            game={game}
          />
        )}
      </CloseButtonPanel>
    </div>
  );
};
