import React, { useState } from "react";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";

type Props = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "width" | "height" | "style" | "onLoad"
> & {
  /** Called after intrinsic size is known and CSS dimensions are applied. */
  onSized?: (sourcePx: { width: number; height: number }) => void;
};

/**
 * Renders raster art at `naturalWidth|Height * PIXEL_SCALE` CSS px (same convention as land / HUD).
 * Reads intrinsic dimensions on load so CDN and bundled assets both scale correctly.
 */
export const MinigameScaledSpriteImg: React.FC<Props> = ({
  src,
  alt = "",
  className,
  draggable = false,
  onSized,
  ...rest
}) => {
  const [srcPx, setSrcPx] = useState<{ w: number; h: number } | null>(null);

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth > 0 && naturalHeight > 0) {
      const next = { w: naturalWidth, h: naturalHeight };
      setSrcPx(next);
      onSized?.({ width: next.w, height: next.h });
    }
  };

  const scaled =
    srcPx != null
      ? {
          width: srcPx.w * PIXEL_SCALE,
          height: srcPx.h * PIXEL_SCALE,
        }
      : undefined;

  return (
    <img
      src={src}
      alt={alt}
      draggable={draggable}
      className={classNames("block shrink-0", className)}
      style={{
        imageRendering: "pixelated",
        ...scaled,
      }}
      onLoad={onLoad}
      {...rest}
    />
  );
};
