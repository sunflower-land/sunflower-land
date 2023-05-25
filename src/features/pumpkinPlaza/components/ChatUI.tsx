import React, { useState } from "react";

import { ChatText } from "./ChatText";
import { GameState } from "features/game/types/game";
import { ReactionName } from "../lib/reactions";

interface Props {
  game: GameState;
  messages: { sessionId: string; text: string }[];
  onMessage: (content: { text?: string; reaction?: ReactionName }) => void;
}
export const ChatUI: React.FC<Props> = ({ onMessage, game, messages }) => {
  const [tab, setTab] = useState(0);

  return (
    <div
      className="w-full flex fixed top-4 left-4 pl-2 pr-[73.5px] md:pr-2 z-40"
      onClick={console.log}
    >
      <ChatText messages={messages} onMessage={(text) => onMessage({ text })} />
    </div>
  );
};
