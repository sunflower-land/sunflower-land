import React, { useEffect, useState } from "react";
import stringSimilarity from "string-similarity";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ChatText } from "./ChatText";
import { Label } from "components/ui/Label";
import { GameState } from "features/game/types/game";
import { Room } from "colyseus.js";
import { PlazaRoomState } from "features/world/types/Room";
import { SceneId } from "features/world/mmoMachine";
import { Reactions } from "./Reactions";

export type Message = {
  createdAt: number;
  sceneId: SceneId;
  text: string;
  username: string;
  authorSessionId: string;
  authorId: number;
  messageId: string;
};

interface Props {
  farmId: number;
  gameState: GameState;
  mmoService?: Room<PlazaRoomState>;
  scene: SceneId;
}

export const ChatUI: React.FC<Props> = ({
  farmId,
  gameState,
  mmoService,
  scene,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [option, setOption] = useState<"chat" | "reaction" | null>(null);

  const [cooldown, setCooldown] = useState<number>(0);
  const [messageCountOnClose, setMessageCountOnClose] = useState(0);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const [messages, setMessages] = useState<Message[]>(
    Array.from(mmoService?.state.messages ?? []),
  );

  // Listen to new messages
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleMessageDelete = (message: Message, index: number) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages.splice(index, 1);
        return newMessages;
      });
    };

    mmoService?.state.messages.onAdd(handleNewMessage);
    mmoService?.state.messages.onRemove(handleMessageDelete);

    return () => {
      mmoService?.state.messages.onAdd(handleNewMessage);
      mmoService?.state.messages.onRemove(handleMessageDelete);
    };
  }, [mmoService]);

  // Update new message count when the chat is closed
  useEffect(() => {
    if (!showOptions) {
      const unreadMessages = messages.length - messageCountOnClose;
      setNewMessageCount(unreadMessages);
    }
  }, [messages.length, showOptions]);

  const handleChatOpen = () => {
    setMessageCountOnClose(messages.length);
    setNewMessageCount(0);
    setShowOptions(true);
    setOption("chat");
  };

  const handleChatClose = () => {
    setShowOptions(false);
    setMessageCountOnClose(messages.length);
    setOption(null);
  };

  // Message handler
  const onMessage = (text: string) => {
    // Check for duplicate messages
    const recentMessages = messages.filter(
      (msg) =>
        msg.authorId === farmId && msg.createdAt > Date.now() - 60 * 1000, // Within the last minute
    );

    const isDuplicate = recentMessages.some(
      (msg) =>
        stringSimilarity.compareTwoStrings(
          msg.text.toLowerCase(),
          text.toLowerCase(),
        ) > 0.6,
    );

    if (isDuplicate && recentMessages.length >= 3) {
      setCooldown(Date.now() + 90 * 1000); // Apply cooldown
      return;
    }

    mmoService?.send("player:message", { text });
  };

  // Reaction handler
  const onReaction = (reaction: "heart" | "sad" | "happy") => {
    mmoService?.send("player:reaction", { reaction });
  };

  // Bud placement handler
  const onBudPlace = (tokenId: number) => {
    mmoService?.send("player:bud:place", { budId: tokenId });
  };

  return (
    <>
      {/* Chat Messages */}
      <div
        className={classNames(
          "absolute top-48 left-3 transition-transform origin-top-left ease-in-out duration-300",
          { "scale-0": option !== "chat", "scale-100": option === "chat" },
        )}
      >
        <ChatText
          messages={messages}
          onMessage={onMessage}
          cooledDownAt={cooldown}
        />
      </div>

      {/* Reaction UI Placeholder */}
      <div
        className={classNames(
          "absolute top-44 left-3 transition-transform origin-top-left ease-in-out duration-300",
          {
            "scale-0": option !== "reaction",
            "scale-100": option === "reaction",
          },
        )}
      >
        <Reactions
          gameState={gameState}
          onReact={onReaction}
          onBudPlace={onBudPlace}
          scene={scene}
        />
      </div>

      {/* Chat Button */}
      <div
        className={classNames(
          "absolute cursor-pointer top-36 transition-transform origin-top-left ease-in-out duration-300",
          { "scale-50": showOptions },
        )}
        style={{
          left: `${PIXEL_SCALE * 4}px`,
          width: `${PIXEL_SCALE * 22}px`,
          zIndex: 49,
        }}
        onClick={showOptions ? () => setOption("chat") : handleChatOpen}
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

      {showOptions && (
        <>
          <div
            className={classNames(
              "absolute top-36 left-12 cursor-pointer transition-transform origin-top-left ease-in-out duration-300",
              { "scale-50": showOptions },
            )}
            style={{
              left: `${PIXEL_SCALE * 18}px`,
              width: `${PIXEL_SCALE * 22}px`,
              zIndex: 49,
            }}
            onClick={() => setOption("reaction")}
          >
            <img
              src={SUNNYSIDE.icons.disc}
              style={{ width: `${PIXEL_SCALE * 22}px` }}
            />
            <img
              src={SUNNYSIDE.icons.heart}
              style={{ width: `${PIXEL_SCALE * 9}px` }}
              className="top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div
            className="absolute top-36 left-20 cursor-pointer transition-transform origin-top-left ease-in-out duration-300 scale-50"
            style={{
              left: `${PIXEL_SCALE * 32}px`,
              width: `${PIXEL_SCALE * 22}px`,
              zIndex: 49,
            }}
            onClick={handleChatClose}
          >
            <img
              src={SUNNYSIDE.icons.disc}
              style={{ width: `${PIXEL_SCALE * 22}px` }}
            />
            <img
              src={SUNNYSIDE.icons.cancel}
              style={{ width: `${PIXEL_SCALE * 9}px` }}
              className="top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </>
      )}
    </>
  );
};
