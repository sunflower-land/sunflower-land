import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

type RequestBubbleProps = {
  top: number;
  left: number;
  image: {
    src: string;
    height: number;
    width: number;
  };
  quantity?: number;
};

export const RequestBubble: React.FC<RequestBubbleProps> = ({
  image,
  top,
  left,
  quantity,
}) => {
  const parentWidth = image.width + (quantity ? 15 : 0) + PIXEL_SCALE * 5;

  return (
    <div
      className="absolute inline-flex justify-center items-center z-40"
      style={{
        top: `${top}px`,
        left: `${left}px`,

        borderImage: `url(${SUNNYSIDE.ui.speechBorder})`,
        borderStyle: "solid",
        borderTopWidth: `${PIXEL_SCALE * 2}px`,
        borderRightWidth: `${PIXEL_SCALE * 2}px`,
        borderBottomWidth: `${PIXEL_SCALE * 4}px`,
        borderLeftWidth: `${PIXEL_SCALE * 5}px`,

        borderImageSlice: "2 2 4 5 fill",
        imageRendering: "pixelated",
        borderImageRepeat: "stretch",
        width: `${parentWidth}px`,
        // No need for explicit width or height
      }}
    >
      <div
        className="flex justify-center items-center"
        style={{
          marginLeft: `-${(PIXEL_SCALE * 5) / 2}px`,
        }}
      >
        <img src={image.src} style={{ width: `${image.width}px` }} />
        {quantity && <p className="text-xxs">{`x${quantity}`}</p>}
      </div>
    </div>
  );
};
