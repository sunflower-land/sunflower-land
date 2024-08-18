import React, { useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import grass from "assets/brand/grass_background_2.png";
import smallBoost from "assets/icons/small_boost.png";
import { ButtonPanel } from "components/ui/Panel";

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
  hasBoost,
  price,
  onClick,
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setSize({ width: img.width, height: img.height });
    };
  }, []);

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <ButtonPanel>
        <div className="w-32 sm:w-40 flex flex-col">
          <div className="relative">
            <p className="text-white absolute top-1 left-1 text-xs">{`x${supply}`}</p>
            <div
              style={{
                backgroundImage: `url(${grass})`,
              }}
              className="w-full h-32 rounded-md flex justify-center items-center"
            >
              <img
                src={image}
                style={{
                  height: `${size.height * PIXEL_SCALE}px`,
                  width: `${size.width * PIXEL_SCALE}px`,
                }}
              />
              {hasBoost && (
                <img src={smallBoost} className="absolute top-1 right-1" />
              )}
            </div>
          </div>

          <p className="my-1 pb-5">{name}</p>
        </div>
      </ButtonPanel>

      <Label
        className="absolute bottom-0 left-0 !w-full"
        type="warning"
      >{`${price} SFL`}</Label>
    </div>
  );
};
