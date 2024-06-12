import { SpringValue, useSpringValue, config } from "@react-spring/web";
import { usePinch } from "@use-gesture/react";
import React, { createContext, useEffect } from "react";

const getScaleLimits = () => {
  const minScale = 0.5;
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
  // ON HOLD: Looking to implement landscape mode for mobile. This is causing some serious bugs on iOS
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
