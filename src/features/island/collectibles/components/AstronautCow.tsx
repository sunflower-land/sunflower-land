import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";
import { ImageStyle } from "./template/ImageStyle";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const AstronautCow: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Astronaut Cow">
      <ImageStyle
        name="Astronaut Cow"
        divStyle={{
          width: `${PIXEL_SCALE * 25}px`,
          bottom: `${PIXEL_SCALE * -2}px`,
          left: `${PIXEL_SCALE * -4.5}px`,
        }}
        imgStyle={{
          width: `${PIXEL_SCALE * 25}px`,
        }}
        image={ITEM_DETAILS["Astronaut Cow"].image}
        alt="Astronaut Cow"
      />
    </SFTDetailPopover>
  );
};
