import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface PixelBackgroundProps {
  image: string;
  backgroundColor?: string;
  brightness?: number;
  children?: React.ReactNode;
}

export const PixelBackground: React.FC<PixelBackgroundProps> = ({
  image,
  backgroundColor = "#63c74d",
  brightness = 1,
  children,
}) => (
  <div
    className="w-screen h-screen relative overflow-hidden bg-repeat"
    style={{
      backgroundColor,
      backgroundImage: `url(${image})`,
      backgroundSize: `${PIXEL_SCALE * 64}px`,
      imageRendering: "pixelated",
      filter: brightness !== 1 ? `brightness(${brightness})` : undefined,
    }}
  >
    {children}
  </div>
);
