import React, { useState } from "react";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MINIGAME_TOKEN_IMAGE_FALLBACK } from "../lib/minigameTokenIcons";

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
const MinigameScaledSpriteImgInner: React.FC<Props> = ({
  src,
  alt = "",
  className,
  draggable = false,
  onSized,
  onError,
  ...rest
}) => {
  const [srcPx, setSrcPx] = useState<{ w: number; h: number } | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const trimmed = typeof src === "string" ? src.trim() : "";
  const displaySrc =
    loadFailed || !trimmed ? MINIGAME_TOKEN_IMAGE_FALLBACK : String(src ?? "");

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth > 0 && naturalHeight > 0) {
      const next = { w: naturalWidth, h: naturalHeight };
      setSrcPx(next);
      onSized?.({ width: next.w, height: next.h });
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onError?.(e);
    setLoadFailed(true);
  };

  const fallbackPx = 16;
  const scaled =
    srcPx != null
      ? {
          width: srcPx.w * PIXEL_SCALE,
          height: srcPx.h * PIXEL_SCALE,
        }
      : {
          width: fallbackPx * PIXEL_SCALE,
          height: fallbackPx * PIXEL_SCALE,
        };

  return (
    <img
      {...rest}
      src={displaySrc}
      alt={alt}
      draggable={draggable}
      className={classNames("block shrink-0", className)}
      style={{
        imageRendering: "pixelated",
        objectFit: "contain",
        ...scaled,
      }}
      onLoad={onLoad}
      onError={handleError}
    />
  );
};

/** Remounts when `src` changes so load/size state resets without an effect. */
export const MinigameScaledSpriteImg: React.FC<Props> = (props) => (
  <MinigameScaledSpriteImgInner key={String(props.src ?? "")} {...props} />
);
