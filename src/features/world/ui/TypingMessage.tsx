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
    if (forceShowFullMessage) {
      setDisplayedMessage(message);
      return;
    }

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

  return <div className="text-sm">{displayedMessage}</div>;
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
    <div className="relative">
      <div className="text-sm absolute inset-0">{displayedMessage}</div>
      {/* Render a hidden message so the container gets the correct height initially */}
      <div className="text-sm opacity-0">{message}</div>
    </div>
  );
};
