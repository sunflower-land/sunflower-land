import React, { useMemo } from "react";
import { animated, useTransition } from "react-spring";

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
  const items = useMemo(
    () =>
      message
        .trim()
        .split("")
        .map((letter, index) => ({
          item: letter,
          key: index,
        })),
    [message]
  );

  const transitions = useTransition(items, {
    trail,
    from: { display: "none" },
    enter: { display: "" },
    onRest: (status, controller, item) => {
      if (item.key === items.length - 1) {
        onMessageEnd(message);
      }
    },
  });

  return (
    <div className="leading-[1]">
      {forceShowFullMessage && <span>{message}</span>}
      {!forceShowFullMessage &&
        transitions((styles, { item, key }) => (
          <animated.span key={key} style={styles}>
            {item}
          </animated.span>
        ))}
    </div>
  );
};
