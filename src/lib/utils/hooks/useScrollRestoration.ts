import { type UIEvent, useCallback, useRef } from "react";

export const useScrollRestoration = <T extends HTMLElement>() => {
  const savedScrollTop = useRef(0);

  const scrollContainerRef = useCallback((element: T | null) => {
    if (!element) return;

    element.scrollTop = savedScrollTop.current;
  }, []);

  const handleScroll = useCallback((event: UIEvent<T>) => {
    savedScrollTop.current = event.currentTarget.scrollTop;
  }, []);

  return { scrollContainerRef, handleScroll };
};
