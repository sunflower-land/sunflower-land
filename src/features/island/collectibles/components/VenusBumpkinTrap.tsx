import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";
import { ImageStyle } from "./template/ImageStyle";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const VenusBumpkinTrap: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Venus Bumpkin Trap">
      <ImageStyle
        name="Venus Bumpkin Trap"
        divStyle={{
          width: `${PIXEL_SCALE * 20}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -1.75}px`,
        }}
        imgStyle={{
          width: `${PIXEL_SCALE * 20}px`,
        }}
        image={ITEM_DETAILS["Venus Bumpkin Trap"].image}
        alt="Venus Bumpkin Trap"
      />
    </SFTDetailPopover>
  );
};
