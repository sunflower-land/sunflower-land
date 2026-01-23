import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";
import { ImageStyle } from "./template/ImageStyle";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const MermaidSheep: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Mermaid Sheep">
      <ImageStyle
        name="Mermaid Sheep"
        divStyle={{
          width: `${PIXEL_SCALE * 25}px`,
          bottom: `0px`,
          left: `${PIXEL_SCALE * -4.5}px`,
        }}
        imgStyle={{
          width: `${PIXEL_SCALE * 25}px`,
        }}
        image={ITEM_DETAILS["Mermaid Sheep"].image}
        alt="Mermaid Sheep"
      />
    </SFTDetailPopover>
  );
};
