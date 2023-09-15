import React, { useEffect, useState } from "react";
import stringSimilarity from "string-similarity";
import { ReactionName } from "../lib/reactions";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { ChatText } from "./ChatText";
import { Label } from "components/ui/Label";
import { SceneId } from "features/world/mmoMachine";

export type Message = {
  farmId: number;
  sessionId: string;
  text: string;
  sceneId: SceneId;
  sentAt: number;
};
interface Props {
  farmId: number;
  messages: Message[];
  onMessage: (content: { text?: string; reaction?: ReactionName }) => void;
  isMuted?: boolean;
}

export const ChatUI: React.FC<Props> = ({
  farmId,
  onMessage,
  messages,
  isMuted,
}) => {
  const [showChat, setShowChat] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [messageCountOnChatClose, setMessageCountOnChatClose] = useState(0);
  const [newMessageCount, setNewMessageCount] = useState(0);

  useEffect(() => {
    if (!showChat) {
      const newMessageCount = messages.length - messageCountOnChatClose;

      setNewMessageCount(newMessageCount);
    }
  }, [messages.length]);

  useEffect(() => {
    if (isMuted && showChat) {
      setShowChat(false);
    }
  }, [isMuted]);

  const handleChatOpen = () => {
    if (isMuted) return;

    setMessageCountOnChatClose(0);
    setNewMessageCount(0);
    setShowChat(true);
  };

  const handleChatClose = () => {
    setShowChat(false);
    setMessageCountOnChatClose(messages.length);
  };

  const sendMessage = (text: string) => {
    const duplicates = messages.filter((message) => {
      if (message.farmId !== farmId) {
        return false;
      }

      // Longer than 1 minute ago
      if (message.sentAt && message.sentAt < Date.now() - 60 * 1000) {
        return false;
      }

      const similarity = stringSimilarity.compareTwoStrings(
        message.text.toLowerCase(),
        text.toLowerCase()
      );

      return similarity > 0.6;
    });

    if (duplicates.length >= 3) {
      setCooldown(Date.now() + 90 * 1000);
    }
    onMessage({ text });
  };

  return (
    <>
      <div
        className={classNames(
          "fixed top-48 left-3 transition-transform origin-top-left ease-in-out duration-300",
          { "scale-0": !showChat, "scale-100": showChat }
        )}
        onClick={console.log}
      >
        <ChatText
          messages={messages}
          onMessage={sendMessage}
          cooledDownAt={cooldown}
        />
      </div>
      <div
        className={classNames(
          "fixed top-36 left-3 cursor-pointer transition-transform origin-top-left ease-in-out duration-300",
          {
            "scale-50": showChat,
            "opacity-50": isMuted,
            "cursor-not-allowed": isMuted,
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
