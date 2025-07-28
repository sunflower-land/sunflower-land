import { useCallback, useRef, useState } from "react";

export const useScrollToBottom = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollNode, setScrollNode] = useState<HTMLDivElement | null>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(true);

  const checkIsAtBottom = (el: HTMLDivElement) => {
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distance <= 1;
  };

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return;

    requestAnimationFrame(() => {
      const el = containerRef.current!;
      el.scrollTop = el.scrollHeight;

      setScrolledToBottom(checkIsAtBottom(el));
    });
  }, []);

  const refCallback = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    containerRef.current = node;
    setScrollNode(node);

    const handleScroll = () => {
      setScrolledToBottom(checkIsAtBottom(node));
    };

    node.addEventListener("scroll", handleScroll);
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(node);

    // Initial check
    handleScroll();

    return () => {
      node.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return {
    scrollContainerRef: refCallback, // use in JSX: ref={scrollContainerRef}
    scrollToBottom,
    scrolledToBottom,
    scrollNode, // use for IntersectionObserver root
  };
};
