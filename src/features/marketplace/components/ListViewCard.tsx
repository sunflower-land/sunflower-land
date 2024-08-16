import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React from "react";

type Props = {
  name: string;
  image: string;
  hasBoost: boolean;
  supply: number;
  price: Decimal;
  onClick?: () => void;
};

export const ListViewCard: React.FC<Props> = ({
  name,
  image,
  supply,
  price,
  onClick,
}) => {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <div
        style={{
          borderImage: `url(${SUNNYSIDE.ui.primaryButton})`,
          borderStyle: "solid",
          borderWidth: `8px 8px 10px 8px`,
          borderImageSlice: "3 3 4 3 fill",
          imageRendering: "pixelated",
          borderImageRepeat: "stretch",
          borderRadius: `${PIXEL_SCALE * 5}px`,
          color: "#674544",
        }}
      >
        <div className="w-32 sm:w-40 flex flex-col">
          <div className="relative">
            <p className="text-white absolute top-1 left-1 text-xs">{`x${supply}`}</p>
            <img src={image} className="w-full rounded-md" />
          </div>

          <p className="my-1 pb-5">{name}</p>
        </div>
      </div>

      <Label
        className="absolute bottom-0 left-0 !w-full"
        type="warning"
      >{`${price} SFL`}</Label>
    </div>
  );
};
