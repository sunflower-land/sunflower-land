import { SpringValue, useSpringValue, config } from "@react-spring/web";
import { usePinch } from "@use-gesture/react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import React, { createContext, useEffect } from "react";

const getScaleLimits = () => {
  const gameboardWidth = 84 * GRID_WIDTH_PX;
  const gameboardHeight = 56 * GRID_WIDTH_PX;

  // For now, you can only zoom if your screen is less than 1/4 of the game board size
  const maxZoomWidth = gameboardWidth / 4;
  const maxZoomHeight = gameboardHeight / 4;

  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );

  const minScale = Math.max(
    Math.min(vw / maxZoomWidth, vh / maxZoomHeight, 1),
    0.5
  );
  const maxScale = 1;

  return { minScale, maxScale };
};

interface Context {
  scale: SpringValue<number>;
}

export const ZoomContext = createContext<Context>({
  scale: new SpringValue(1),
});

export const ZoomProvider: React.FC = ({ children }) => {
  const scale = useSpringValue(1, { config: config.stiff });
  const { minScale, maxScale } = getScaleLimits();

  window.addEventListener("resize", () => scale.start(1));

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);

  usePinch(
    ({ offset: [delta] }) => {
      scale.start(delta);
    },
    {
      target: document.body,
      pointer: { touch: true },
      scaleBounds: { min: minScale, max: maxScale },
    }
  );

  return (
    <ZoomContext.Provider value={{ scale }}>{children}</ZoomContext.Provider>
  );
};
