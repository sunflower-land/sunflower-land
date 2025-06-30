import { useLayoutEffect, useRef } from "react";

export const useScrollToBottom = (deps: any[]) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
    });

    return () => cancelAnimationFrame(frame);
  }, deps);

  return scrollContainerRef;
};
