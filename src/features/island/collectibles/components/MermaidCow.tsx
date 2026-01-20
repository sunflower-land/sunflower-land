import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";
import { ImageStyle } from "./template/ImageStyle";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const MermaidCow: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Mermaid Cow">
      <ImageStyle
        name="Mermaid Cow"
        divStyle={{
          width: `${PIXEL_SCALE * 25}px`,
          bottom: `${PIXEL_SCALE * -2}px`,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        imgStyle={{
          width: `${PIXEL_SCALE * 25}px`,
        }}
        image={ITEM_DETAILS["Mermaid Cow"].image}
        alt="Mermaid Cow"
      />
    </SFTDetailPopover>
  );
};
