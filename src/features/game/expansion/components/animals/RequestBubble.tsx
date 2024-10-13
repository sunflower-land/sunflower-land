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
};

export const RequestBubble: React.FC<RequestBubbleProps> = ({
  image,
  top,
  left,
}) => {
  return (
    <div
      className="absolute flex justify-center items-center"
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
        minWidth: "30px",
        minHeight: "30px",
      }}
    >
      <div
        className="absolute"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          marginLeft: "-3px",
          height: `${image.height}px`,
          width: `${image.width}px`,
        }}
      >
        <img src={image.src} className="w-full h-full" />
      </div>
    </div>
  );
};
