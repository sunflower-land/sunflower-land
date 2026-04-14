import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
import { ImageStyle } from "./template/ImageStyle";
import { ITEM_DETAILS } from "features/game/types/images";

export const BlackHoleFlower: React.FC = () => {
  return (
    <SFTDetailPopover name="Black Hole Flower">
      <ImageStyle
        name="Black Hole Flower"
        divStyle={{
          width: `${PIXEL_SCALE * 28}px`,
          bottom: `${PIXEL_SCALE * -2}px`,
          left: `${PIXEL_SCALE * -6}px`,
        }}
        imgStyle={{
          width: `${PIXEL_SCALE * 28}px`,
        }}
        image={ITEM_DETAILS["Black Hole Flower"].image}
        alt="Black Hole Flower"
      />
    </SFTDetailPopover>
  );
};
