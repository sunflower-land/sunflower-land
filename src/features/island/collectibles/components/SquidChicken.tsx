import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";
import { ImageStyle } from "./template/ImageStyle";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SquidChicken: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Squid Chicken">
      <ImageStyle
        name="Squid Chicken"
        divStyle={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -1.75}px`,
        }}
        imgStyle={{
          width: `${PIXEL_SCALE * 19}px`,
        }}
        image={ITEM_DETAILS["Squid Chicken"].image}
        alt="Squid Chicken"
      />
    </SFTDetailPopover>
  );
};
