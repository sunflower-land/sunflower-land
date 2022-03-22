import { useState, useEffect, useRef } from "react";

/**
 * Hook that returns whether or not the scrollbar should be shown
 * based on the content of a div being more than the content height
 * @param scrollableDivHeight number - height of the scrollable div
 * @returns [ref, boolean]
 */
export const useShowScrollbar = (scrollableDivHeight: number) => {
  const [showScrollbar, setShowScrollbar] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollHeight = ref.current?.scrollHeight;
    if (scrollHeight && scrollHeight > scrollableDivHeight) {
      setShowScrollbar(true);
    }
  }, [ref.current]);

  return { ref, showScrollbar };
};
