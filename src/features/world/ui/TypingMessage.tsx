import React, { useMemo } from "react";
import { animated, useTransition } from "react-spring";

interface Props {
  message: string;
  onMessageEnd: () => void;
  trail?: number;
  forceShowFullMessage?: boolean;
}
export const TypingMessage: React.FC<Props> = ({
  message,
  onMessageEnd,
  trail = 60,
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
        onMessageEnd();
      }
    },
  });

  return (
    <div>
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
