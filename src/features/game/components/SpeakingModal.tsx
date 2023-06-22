import React, { useCallback, useEffect, useState } from "react";

import { Panel } from "../../../components/ui/Panel";
import { Equipped } from "features/game/types/bumpkin";
import classNames from "classnames";
import { TypingMessage } from "features/world/ui/TypingMessage";
import { NPCName } from "lib/npcs";
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
  const [messageEnded, setMessageEnded] = useState(false);
  const [currentTextEnded, setCurrentTextEnded] = useState(false);
  const [forceShowFullMessage, setForceShowFullMessage] = useState(false);

  const handleClick = useCallback(() => {
    if (messageEnded) {
      setMessageEnded(false);
      setForceShowFullMessage(false);
      if (currentMessage < message.length - 1) {
        setCurrentMessage(currentMessage + 1);
        setCurrentTextEnded(false);
      } else {
        setCurrentMessage(0);
        onClose();
      }
    } else {
      setMessageEnded(true);
      setForceShowFullMessage(true);
    }
  }, [currentMessage, messageEnded, message.length]);

  useEffect(() => {
    const handleKeyPressed = (e: KeyboardEvent) => {
      if (["Enter", "Space", "Escape"].includes(e.code)) {
        handleClick();
      }
    };
    window.addEventListener("keydown", handleKeyPressed);

    return () => window.removeEventListener("keydown", handleKeyPressed);
  }, [handleClick]);

  console.log({ currentTextEnded, currentMessage });
  return (
    <Panel
      className={classNames("relative w-full", className)}
      bumpkinParts={bumpkinParts}
    >
      <div className="p-1" style={{ minHeight: "100px" }}>
        <TypingMessage
          message={message[currentMessage].text}
          key={currentMessage}
          onMessageEnd={() => setCurrentTextEnded(true)}
          forceShowFullMessage={forceShowFullMessage}
        />
        {(currentTextEnded || forceShowFullMessage) &&
          message[currentMessage].actions && (
            <div className="flex mt-2 justify-start">
              {message[currentMessage].actions?.map((action) => (
                <Button className="w-auto px-4 mr-2" onClick={action.cb}>
                  {action.text}
                </Button>
              ))}
            </div>
          )}
      </div>
    </Panel>
  );
};
