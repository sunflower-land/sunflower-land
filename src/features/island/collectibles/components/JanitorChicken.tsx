import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";
import { ImageStyle } from "./template/ImageStyle";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const JanitorChicken: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Janitor Chicken">
      <ImageStyle
        name="Janitor Chicken"
        divStyle={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -1.75}px`,
        }}
        imgStyle={{
          width: `${PIXEL_SCALE * 26}px`,
        }}
        image={ITEM_DETAILS["Janitor Chicken"].image}
        alt="Janitor Chicken"
      />
    </SFTDetailPopover>
  );
};
