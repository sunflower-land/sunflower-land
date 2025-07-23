import { useCallback, useEffect, useRef, useState } from "react";

export const useScrollToBottom = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
    });
  }, []);

  const checkIsAtBottom = useCallback(() => {
    const el = scrollContainerRef.current;

    if (!el) return false;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= 1;
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      setScrolledToBottom(checkIsAtBottom());
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [checkIsAtBottom]);

  return { scrollContainerRef, scrollToBottom, scrolledToBottom };
};
