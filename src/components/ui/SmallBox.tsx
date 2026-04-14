import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import Decimal from "decimal.js-light";
import { CountLabel } from "./CountLabel";

type Props = {
  image: string;
  count?: Decimal;
};

export const SmallBox: React.FC<Props> = ({ image, count }) => {
  return (
    <div
      className="bg-brown-600 relative mr-0.5 w-5 h-5 flex justify-center items-center"
      style={{
        width: `${PIXEL_SCALE * 15}px`,
        height: `${PIXEL_SCALE * 15}px`,
        ...pixelDarkBorderStyle,
      }}
    >
      <img src={image} className="w-[90%] h-[90%] object-contain" />
      {count?.gt(0) && (
        <CountLabel
          isHover={false}
          count={count}
          labelType="default"
          rightShiftPx={-13}
          topShiftPx={-11}
        />
      )}
    </div>
  );
};
