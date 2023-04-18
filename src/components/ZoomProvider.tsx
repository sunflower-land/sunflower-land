import { SpringValue, useSpringValue } from "@react-spring/web";
import { usePinch } from "@use-gesture/react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import React, { createContext, useState } from "react";

const getScaleLimits = () => {
  const gameboardWidth = 84 * GRID_WIDTH_PX;
  const gameboardHeight = 56 * GRID_WIDTH_PX;

  // Todo base this off the count of expansions
  const maxZoomWidth = gameboardWidth / 4;
  const maxZoomHeight = gameboardHeight / 4;
  // TODO delete when finished testing
  // const maxZoomWidth = gameboardWidth;
  // const maxZoomHeight = gameboardHeight;

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

const calculateCanZoom = () => {
  const { minScale, maxScale } = getScaleLimits();
  return maxScale !== minScale;
};

interface Context {
  scale: SpringValue;
  setMax: () => void;
  setMin: () => void;
  canZoom: boolean;
  isZoomedIn: boolean;
}

export const ZoomContext = createContext<Context>({
  scale: new SpringValue(1),
  setMax: () => {
    throw new Error("setMax not implement");
  },
  setMin: () => {
    throw new Error("setMin not implement");
  },
  canZoom: false,
  isZoomedIn: false,
});

export const ZoomProvider: React.FC = ({ children }) => {
  const [canZoom, setCanZoom] = useState(calculateCanZoom());
  const [isZoomedIn, setIsZoomedIn] = useState(true);
  const scale = useSpringValue(1);

  window.addEventListener("resize", () => updateScale(0));

  const setMax = () => {
    const { maxScale } = getScaleLimits();
    setScale(maxScale);
  };

  const setMin = () => {
    const { minScale } = getScaleLimits();
    setScale(minScale);
  };

  const setScale = (newScale: number) => {
    const { maxScale, minScale } = getScaleLimits();

    scale.start(newScale);
    setIsZoomedIn(newScale > (maxScale + minScale) / 2);
    setCanZoom(calculateCanZoom());
  };
  const updateScale = (delta: number) => {
    const { minScale, maxScale } = getScaleLimits();

    let newScale = scale.get() + delta;
    if (newScale < minScale) newScale = minScale;
    if (newScale > maxScale) newScale = maxScale;

    setScale(newScale);
  };

  usePinch(
    ({ movement: [s] }) => {
      updateScale(s - 1);
    },
    { target: document.body }
  );

  return (
    <ZoomContext.Provider
      value={{ scale, setMax, setMin, canZoom, isZoomedIn }}
    >
      {children}
    </ZoomContext.Provider>
  );
};
