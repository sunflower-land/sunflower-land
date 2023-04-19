import { SpringValue, useSpringValue } from "@react-spring/web";
import { usePinch } from "@use-gesture/react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import React, { createContext, useState } from "react";

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
  scale: SpringValue;
  isZoomedIn: boolean;
}

export const ZoomContext = createContext<Context>({
  scale: new SpringValue(1),
  isZoomedIn: false,
});

export const ZoomProvider: React.FC = ({ children }) => {
  const [isZoomedIn, setIsZoomedIn] = useState(true);
  const scale = useSpringValue(1);

  window.addEventListener("resize", () => updateScale(0));

  const updateScale = (delta: number) => {
    const { minScale, maxScale } = getScaleLimits();

    let newScale = scale.get() + delta;
    if (newScale < minScale) newScale = minScale;
    if (newScale > maxScale) newScale = maxScale;

    scale.start(newScale);
    setIsZoomedIn(newScale > (maxScale + minScale) / 2);
  };

  usePinch(
    ({ movement: [s] }) => {
      updateScale(s - 1);
    },
    { target: document.body }
  );

  return (
    <ZoomContext.Provider value={{ scale, isZoomedIn }}>
      {children}
    </ZoomContext.Provider>
  );
};
