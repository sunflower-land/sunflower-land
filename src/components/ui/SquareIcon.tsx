import React, { useEffect, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";

interface Props {
  icon: string;
  width: number;
  className?: string;
  style?: React.CSSProperties;
}

const getImage = (icon: string, iconWidth: number) => (
  <img
    src={icon}
    className={`relative`}
    alt="item"
    style={{
      opacity: "0",
    }}
    onLoad={(e) => {
      // get max dimension
      const width = e.currentTarget?.naturalWidth;
      const height = e.currentTarget?.naturalHeight;
      if (!width || !height) {
        return;
      }
      const maxDimension = Math.max(width, height);

      // image scale to match pixel size or fit inner box
      let scale = 1;

      // scale image to match pixel scale if image is small enough
      if (maxDimension <= iconWidth) {
        scale = PIXEL_SCALE;
      }

      // scale image to fit inner frame if image is scaling image to pixel scale will overflow the inner frame
      else if (width < iconWidth * PIXEL_SCALE) {
        scale = (iconWidth * PIXEL_SCALE) / width;
      }

      // shrink image to fit inner frame if image is large and height is greater than width
      if (maxDimension > iconWidth && height > width) {
        scale *= width / height;
      }

      // scale and show image
      e.currentTarget.style.transform = `scale(${scale})`;
      e.currentTarget.style.opacity = "1";
    }}
  />
);

export const SquareIcon: React.FC<Props> = ({
  icon,
  width,
  className,
  style,
}) => {
  const [item, setItem] = useState<JSX.Element | undefined>(
    getImage(icon, width),
  );

  // refreshes image when icon is changed to avoid flickering when resizing image
  useEffect(() => {
    if (!icon) {
      return;
    }
    setItem(undefined);
  }, [icon]);
  useEffect(() => {
    if (item) {
      return;
    }
    setItem(getImage(icon, width));
  }, [item]);

  return (
    <div
      className={classNames("flex justify-center items-center", className)}
      style={{
        width: `${PIXEL_SCALE * width}px`,
        height: `${PIXEL_SCALE * width}px`,
        ...style,
      }}
    >
      {item}
    </div>
  );
};
