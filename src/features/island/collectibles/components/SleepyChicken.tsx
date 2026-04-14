import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";
import { ImageStyle } from "./template/ImageStyle";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SleepyChicken: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Sleepy Chicken">
      <ImageStyle
        name="Sleepy Chicken"
        divStyle={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -5}px`,
        }}
        imgStyle={{
          width: `${PIXEL_SCALE * 26}px`,
        }}
        image={ITEM_DETAILS["Sleepy Chicken"].image}
        alt="Sleepy Chicken"
      />
    </SFTDetailPopover>
  );
};
