import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";
import { ImageStyle } from "./template/ImageStyle";

export const LoveChicken: React.FC<CollectibleProps> = () => {
  return (
    <ImageStyle
      divStyle={{
        width: `${PIXEL_SCALE * 21}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1.75}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 21}px`,
      }}
      image={ITEM_DETAILS["Love Chicken"].image}
      alt="Love Chicken"
    />
  );
};
