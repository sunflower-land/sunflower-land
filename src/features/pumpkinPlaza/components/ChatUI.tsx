import React, { useEffect, useState } from "react";
import stringSimilarity from "string-similarity";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { ChatText } from "./ChatText";
import { Label } from "components/ui/Label";
import { SceneId } from "features/world/mmoMachine";
import { ReactionName, Reactions } from "./Reactions";
import { GameState } from "features/game/types/game";

export type Message = {
  farmId: number;
  username: string;
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
  onCommand?: (name: string, args: string[]) => void;
  onReact: (reaction: ReactionName) => void;
  onBudPlace: (tokenId: number) => void;
  gameState: GameState;
  scene: SceneId;
}

export const ChatUI: React.FC<Props> = ({
  farmId,
  onMessage,
  isMuted,
  onCommand,
  messages,
  gameState,
  onReact,
  onBudPlace,
  scene,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const [option, setOption] = useState<"chat" | "reaction">();

  const [cooldown, setCooldown] = useState<number>(0);
  const [messageCountOnChatClose, setMessageCountOnChatClose] = useState(0);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const canReact = true;
  useEffect(() => {
    if (!showOptions) {
      const newMessageCount = messages.length - messageCountOnChatClose;

      setNewMessageCount(newMessageCount);
    }
  }, [messages.length]);

  useEffect(() => {
    if (isMuted && showOptions) {
      setShowOptions(false);
    }
  }, [isMuted]);

  const handleChatOpen = () => {
    if (isMuted) return;

    setMessageCountOnChatClose(0);
    setNewMessageCount(0);
    setShowOptions(true);
    setOption("chat");
  };

  const handleChatClose = () => {
    setShowOptions(false);
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
        text.toLowerCase(),
      );

      return similarity > 0.6;
    });

    if (duplicates.length >= 3) {
      setCooldown(Date.now() + 90 * 1000);
    }
    onMessage({ text });
  };

  const sendCommand = (command: string) => {
    const [name, ...args] = command.split(" ");
    onCommand?.(name, args);
  };

  const showChatMessages = showOptions && option === "chat";
  const showReactions = showOptions && option === "reaction";

  return (
    <>
      <div
        className={classNames(
          "absolute top-48 left-3 transition-transform origin-top-left ease-in-out duration-300",
          { "scale-0": !showChatMessages, "scale-100": showChatMessages },
        )}
        // eslint-disable-next-line no-console
        onClick={console.log}
      >
        <ChatText
          messages={messages}
          onMessage={sendMessage}
          onCommand={sendCommand}
          cooledDownAt={cooldown}
        />
      </div>
      <div
        className={classNames(
          "absolute top-44 left-3 transition-transform origin-top-left ease-in-out duration-300",
          { "scale-0": !showReactions, "scale-100": showReactions },
        )}
        // eslint-disable-next-line no-console
        onClick={console.log}
      >
        <Reactions
          gameState={gameState}
          onReact={onReact}
          onBudPlace={onBudPlace}
          scene={scene}
        />
      </div>

      <div
        className={classNames(
          "absolute cursor-pointer top-36 transition-transform origin-top-left ease-in-out duration-300",
          {
            "scale-50": showOptions,
            "opacity-50": isMuted,
            "cursor-not-allowed": isMuted,
          },
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
      {canReact && (
        <div
          className={classNames(
            "absolute top-36 left-12 cursor-pointer transition-transform origin-top-left ease-in-out duration-300 scale-0",
            {
              "scale-50": showOptions,
            },
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
      )}
      <div
        className={classNames(
          "absolute top-36 left-20 cursor-pointer transition-transform origin-top-left ease-in-out duration-300 scale-0",
          {
            "scale-50": showOptions,
          },
        )}
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
  );
};
