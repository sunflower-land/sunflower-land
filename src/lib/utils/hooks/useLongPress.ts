import { useCallback, useRef, useState } from "react";
import Decimal from "decimal.js-light";

function preventDefault(e: Event) {
  if (!isTouchEvent(e)) return;

  if (e.touches.length < 2 && e.preventDefault) {
    e.preventDefault();
  }
}

function isTouchEvent(e: Event): e is TouchEvent {
  return e && "touches" in e;
}

export const useLongPress = (
  onClick: (e: React.MouseEvent | React.TouchEvent) => void,
  count = new Decimal(0),
  { shouldPreventDefault = true, delay = 300, interval = 200 } = {},
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const timer = useRef<ReturnType<typeof setInterval>>();
  const target = useRef<EventTarget>();

  const clear = useCallback(
    (e: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
      // Clear timeout and timer
      timeout.current && clearTimeout(timeout.current);
      timer.current && clearInterval(timer.current);
      // Perform normal click if long-press didn't happen or after we hit the limit
      shouldTriggerClick && !longPressTriggered && onClick(e);
      setLongPressTriggered(false);
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered],
  );

  const start = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (shouldPreventDefault && e.target) {
        e.target.addEventListener("touchend", preventDefault, {
          passive: false,
        });
        target.current = e.target;
      }
      timeout.current = setTimeout(() => {
        // Remember remaining items count on long-press start
        let remaining = count.toNumber();
        // Call onClick in a loop until we run out of items or long-press is canceled
        timer.current = setInterval(() => {
          if (remaining <= 1) {
            clear(e, false);
          } else {
            onClick(e);
            remaining -= 1;
          }
        }, interval);
        setLongPressTriggered(true);
      }, delay);
    },
    [onClick, delay, interval, count, clear, shouldPreventDefault],
  );

  // Return event handlers
  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
  };
};
