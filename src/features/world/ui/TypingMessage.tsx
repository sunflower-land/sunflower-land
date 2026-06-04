import React, { useState, useEffect } from "react";

interface Props {
  message: string;
  onMessageEnd: (message: string) => void;
  trail?: number;
  forceShowFullMessage?: boolean;
}

export const TypingMessage: React.FC<Props> = ({
  message,
  onMessageEnd,
  trail = 30,
  forceShowFullMessage = false,
}) => {
  const [displayedMessage, setDisplayedMessage] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < message.length) {
        const newDisplayedMessage = message.substring(0, currentIndex + 1);
        setDisplayedMessage(newDisplayedMessage);
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(interval);
        onMessageEnd(message);
      }
    }, trail);

    return () => {
      clearInterval(interval);
    };
  }, [message, forceShowFullMessage, trail, currentIndex, onMessageEnd]);

  return (
    <div className="text-sm">
      {forceShowFullMessage ? message : displayedMessage}
    </div>
  );
};

export const InlineDialogue: React.FC<{
  message: string;
  trail?: number;
}> = ({ message, trail = 30 }) => {
  const [displayedMessage, setDisplayedMessage] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < message.length) {
        const newDisplayedMessage = message.substring(0, currentIndex + 1);
        setDisplayedMessage(newDisplayedMessage);
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, trail);

    return () => {
      clearInterval(interval);
    };
  }, [message, trail, currentIndex]);

  return (
    <div className="grid">
      <div className="text-sm col-start-1 row-start-1">{displayedMessage}</div>
      {/* Render a hidden message in the same grid cell so the container reserves
          the full height up front without the visible text overflowing it. */}
      <div className="text-sm col-start-1 row-start-1 invisible" aria-hidden>
        {message}
      </div>
    </div>
  );
};
