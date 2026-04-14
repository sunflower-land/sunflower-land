import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";
import { ImageStyle } from "./template/ImageStyle";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BabySheep: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Baby Sheep">
      <ImageStyle
        name="Baby Sheep"
        divStyle={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        imgStyle={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
        image={ITEM_DETAILS["Baby Sheep"].image}
        alt="Baby Sheep"
      />
    </SFTDetailPopover>
  );
};
