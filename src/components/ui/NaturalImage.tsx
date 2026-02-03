import React, { useCallback, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";

export interface NaturalImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "width" | "height"> {
  /**
   * Max width in natural (unscaled) pixels before PIXEL_SCALE.
   */
  maxWidth?: number;
  /**
   * Max height in natural (unscaled) pixels before PIXEL_SCALE.
   */
  maxHeight?: number;
}

export const NaturalImage: React.FC<NaturalImageProps> = ({
  maxWidth,
  maxHeight,
  onLoad,
  src,
  style,
  ...props
}) => {
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
    src?: string;
  } | null>(null);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth, naturalHeight } = event.currentTarget;

      if (naturalWidth > 0 && naturalHeight > 0) {
        setNaturalSize({ width: naturalWidth, height: naturalHeight, src });
      }

      onLoad?.(event);
    },
    [onLoad, src],
  );

  const scaledSize = (() => {
    if (!naturalSize || naturalSize.src !== src) return null;

    const { width, height } = naturalSize;
    const maxWidthScale = maxWidth ? Math.min(1, maxWidth / width) : 1;
    const maxHeightScale = maxHeight ? Math.min(1, maxHeight / height) : 1;
    const scale = Math.min(maxWidthScale, maxHeightScale);

    return {
      width: width * PIXEL_SCALE * scale,
      height: height * PIXEL_SCALE * scale,
    };
  })();

  const mergedStyle = scaledSize
    ? { ...style, width: scaledSize.width, height: scaledSize.height }
    : style;

  return <img {...props} src={src} style={mergedStyle} onLoad={handleLoad} />;
};
