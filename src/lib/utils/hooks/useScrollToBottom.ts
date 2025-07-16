import { useCallback, useRef } from "react";

export const useScrollToBottom = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
    });
  }, []);

  return { scrollContainerRef, scrollToBottom };
};
