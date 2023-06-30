import React, { useCallback, useEffect, useState } from "react";

import { Panel } from "../../../components/ui/Panel";
import { Equipped } from "features/game/types/bumpkin";
import classNames from "classnames";
import { TypingMessage } from "features/world/ui/TypingMessage";
import { Button } from "components/ui/Button";

export interface PanelTabs {
  icon: string;
  name: string;
  unread?: boolean;
}

interface Props {
  onClose: () => void;
  onBack?: () => void;
  bumpkinParts?: Partial<Equipped>;
  className?: string;
  message: { text: string; actions?: { text: string; cb: () => void }[] }[];
}

/**
 * A custom panel built for talking NPCs.
 */
export const SpeakingModal: React.FC<Props> = ({
  onClose,
  onBack,
  bumpkinParts,
  className,
  message,
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentTextEnded, setCurrentTextEnded] = useState(false);
  const [forceShowFullMessage, setForceShowFullMessage] = useState(false);

  const handleClick = useCallback(() => {
    // Cannot accidentally click through last message
    if (currentTextEnded && currentMessage === message.length - 1) {
      return;
    }

    if (currentTextEnded) {
      setCurrentTextEnded(false);
      setForceShowFullMessage(false);

      if (currentMessage < message.length - 1) {
        setCurrentMessage(currentMessage + 1);
      } else {
        setCurrentMessage(0);
        onClose();
      }
    } else {
      setCurrentTextEnded(true);
      setForceShowFullMessage(true);
    }
  }, [currentTextEnded, currentMessage, message.length]);

  useEffect(() => {
    const handleKeyPressed = (e: KeyboardEvent) => {
      if (["Enter", "Space", "Escape"].includes(e.code)) {
        handleClick();
      }
    };
    window.addEventListener("keydown", handleKeyPressed);

    return () => window.removeEventListener("keydown", handleKeyPressed);
  }, [handleClick]);

  const showActions =
    (currentTextEnded || forceShowFullMessage) &&
    message[currentMessage].actions;
  return (
    <Panel
      className={classNames("relative w-full", className)}
      bumpkinParts={bumpkinParts}
    >
      <div
        className="p-1 flex flex-col cursor-pointer"
        style={{ minHeight: "100px" }}
        onClick={handleClick}
      >
        <div className="flex-1  pb-2">
          <TypingMessage
            message={message[currentMessage].text}
            key={currentMessage}
            onMessageEnd={() => setCurrentTextEnded(true)}
            forceShowFullMessage={forceShowFullMessage}
          />
          {showActions && (
            <div className="flex mt-2 justify-start ">
              {message[currentMessage].actions?.map((action) => (
                <Button
                  key={action.text}
                  className="w-auto px-4 mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    action.cb();
                  }}
                >
                  {action.text}
                </Button>
              ))}
            </div>
          )}
        </div>
        {currentMessage !== message.length - 1 && (
          <p className="text-xxs italic float-right">(Tap to continue)</p>
        )}
      </div>
    </Panel>
  );
};
