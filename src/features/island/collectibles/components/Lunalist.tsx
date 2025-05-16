import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";
import { ImageStyle } from "./template/ImageStyle";

export const Lunalist: React.FC<CollectibleProps> = () => (
  <ImageStyle
    divStyle={{
      width: `${PIXEL_SCALE * 18}px`,
      bottom: `${PIXEL_SCALE * 1.5}px`,
      left: `${PIXEL_SCALE * 0}px`,
    }}
    imgStyle={{
      width: `${PIXEL_SCALE * 18}px`,
    }}
    image={ITEM_DETAILS["Lunalist"].image}
    alt="Lunalist"
  />
);
