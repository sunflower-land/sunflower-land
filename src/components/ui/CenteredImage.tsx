import React from "react";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface CenteredImageProps {
  src: string;
  alt: string;
  pixelWidth: number;
  loaded?: boolean;
  onLoad?: () => void;
}

export const CenteredImage: React.FC<CenteredImageProps> = ({
  src,
  alt,
  pixelWidth,
  loaded = true,
  onLoad,
}) => (
  <img
    src={src}
    alt={alt}
    className={classNames(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000",
      {
        "opacity-0": !loaded,
        "opacity-100": loaded,
      },
    )}
    style={{
      width: `${PIXEL_SCALE * pixelWidth}px`,
      maxWidth: "none",
      maxHeight: "none",
    }}
    onLoad={onLoad}
  />
);
