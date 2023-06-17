import React, { useCallback, useEffect, useState } from "react";

import { Panel } from "../../../components/ui/Panel";
import { Equipped } from "features/game/types/bumpkin";
import classNames from "classnames";
import { TypingMessage } from "features/world/ui/TypingMessage";
import { NPCName } from "lib/npcs";

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
  text: string[];
  npc: NPCName;
}

/**
 * A custom panel built for talking NPCs.
 */
export const SpeakingModal: React.FC<Props> = ({
  onClose,
  onBack,
  bumpkinParts,
  className,
  text,
  npc,
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [messageEnded, setMessageEnded] = useState(false);
  const [forceShowFullMessage, setForceShowFullMessage] = useState(false);

  const handleClick = useCallback(() => {
    if (messageEnded) {
      setMessageEnded(false);
      setForceShowFullMessage(false);
      if (currentMessage < text.length - 1) {
        setCurrentMessage(currentMessage + 1);
      } else {
        setCurrentMessage(0);
        onClose();
      }
    } else {
      setMessageEnded(true);
      setForceShowFullMessage(true);
    }
  }, [currentMessage, messageEnded, text.length]);

  useEffect(() => {
    const handleKeyPressed = (e: KeyboardEvent) => {
      if (["Enter", "Space", "Escape"].includes(e.code)) {
        handleClick();
      }
    };
    window.addEventListener("keydown", handleKeyPressed);

    return () => window.removeEventListener("keydown", handleKeyPressed);
  }, [handleClick]);

  return (
    <Panel
      className={classNames("relative w-full", className)}
      bumpkinParts={bumpkinParts}
    >
      <div className="p-1" style={{ minHeight: "100px" }}>
        <TypingMessage
          message={text[currentMessage]}
          onMessageEnd={() => console.log("ended")}
          forceShowFullMessage={forceShowFullMessage}
        />
      </div>
    </Panel>
  );
};
