import React, { useEffect, useState } from "react";

import { GameState } from "features/game/types/game";
import { ReactionName } from "../lib/reactions";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { ChatText } from "./ChatText";
import { Label } from "components/ui/Label";

interface Props {
  game: GameState;
  messages: { sessionId: string; text: string }[];
  onMessage: (content: { text?: string; reaction?: ReactionName }) => void;
  onChatStarted: () => void;
  onChatClose: () => void;
}

export const ChatUI: React.FC<Props> = ({
  onMessage,
  game,
  messages,
  onChatStarted,
  onChatClose,
}) => {
  const [showChat, setShowChat] = useState(false);
  const [messageCountOnChatClose, setMessageCountOnChatClose] = useState(0);
  const [newMessageCount, setNewMessageCount] = useState(0);

  useEffect(() => {
    if (!showChat) {
      const newMessageCount = messages.length - messageCountOnChatClose;

      setNewMessageCount(newMessageCount);
    }
  }, [messages.length]);

  const handleChatOpen = () => {
    setMessageCountOnChatClose(0);
    setNewMessageCount(0);
    setShowChat(true);
  };

  const handleChatClose = () => {
    setShowChat(false);
    setMessageCountOnChatClose(messages.length);
    onChatClose();
  };

  return (
    <>
      <div
        className={classNames(
          "w-full fixed top-48 left-3 transition-transform origin-top-left ease-in-out duration-300",
          { "scale-0": !showChat, "scale-100": showChat }
        )}
        onClick={console.log}
      >
        <ChatText
          messages={messages}
          onMessage={(text) => onMessage({ text })}
          isChatOpen={showChat}
          onChatStarted={onChatStarted}
        />
      </div>
      <div
        className={classNames(
          "fixed top-36 left-3 cursor-pointer transition-transform origin-top-left ease-in-out duration-300",
          {
            "scale-50": showChat,
          }
        )}
        style={{ width: `${PIXEL_SCALE * 22}px`, zIndex: 51 }}
        onClick={showChat ? handleChatClose : handleChatOpen}
      >
        <img
          src={SUNNYSIDE.icons.disc}
          style={{ width: `${PIXEL_SCALE * 22}px` }}
        />
        <img
          src={SUNNYSIDE.icons.expression_chat}
          style={{ width: `${PIXEL_SCALE * 9}px` }}
          className="top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2"
        />
        {newMessageCount > 0 && (
          <div className="absolute -top-[3px] -right-[3px]">
            <Label type="info" className="px-0.5 text-xxs">
              {newMessageCount}
            </Label>
          </div>
        )}
      </div>
    </>
  );
};
