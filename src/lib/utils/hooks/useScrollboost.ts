// This file comes from the react-scrollbooster package: https://github.com/oberonamsterdam/react-scrollbooster

import {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ScrollBooster, { ScrollBoosterOptions } from "scrollbooster";

export interface ScrollBoostOptions
  extends Omit<ScrollBoosterOptions, "viewport" | "content"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentRef?: MutableRefObject<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewportRef?: MutableRefObject<any>;
}

export interface ScrollBoostProps {
  viewport: (node: HTMLElement | null) => void;
  scrollbooster: ScrollBooster | null;
}

/**
 * Returns ref values for the viewport and the scrollbooster instance
 */
const useScrollBoost = <T extends HTMLElement>(
  options: ScrollBoostOptions = {}
) => {
  const scrollBooster = useRef<ScrollBooster | null>(null);
  const [scrollBoosterState, setScrollBoosterState] = useState(
    scrollBooster.current
  );

  // options shouldn't change within the hook but can be changed on the scrollBooster instance
  const optionsRef = useRef(options);

  const initScrollBoost = useCallback(<T extends HTMLElement>(node: T) => {
    const { contentRef, viewportRef, ...rest } = optionsRef.current;
    const sbOptions: ScrollBoosterOptions = {
      viewport: node,
      ...rest,
    } as unknown as ScrollBoosterOptions;

    sbOptions.viewport = node;

    if (contentRef?.current) {
      sbOptions.content = contentRef.current;
    }

    // create the scrollbooster instance
    scrollBooster.current = new ScrollBooster(sbOptions);
    setScrollBoosterState(scrollBooster.current);
  }, []);

  const viewport = useCallback(
    (node: T | null) => {
      if (node) {
        if (options.viewportRef) {
          // eslint-disable-next-line no-param-reassign
          options.viewportRef.current = node;
          return;
        }
        initScrollBoost(node);
      }
    },
    [initScrollBoost, options.viewportRef]
  );

  useEffect(() => {
    if (options.viewportRef?.current) {
      initScrollBoost(options.viewportRef.current);
    }
  }, [initScrollBoost, options.viewportRef]);

  useEffect(() => {
    // clear the scrollbooster eventlisteners
    return () => scrollBooster.current?.destroy();
  }, []);

  return [viewport, scrollBoosterState] as const;
};

export interface ScrollBoostConfig
  extends Omit<ScrollBoostOptions, "viewport" | "onUpdate" | "content"> {
  children: (props: ScrollBoostProps) => ReactNode;
}

export { useScrollBoost };
