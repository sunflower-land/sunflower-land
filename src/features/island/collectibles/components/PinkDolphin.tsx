import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PinkDolphin: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Pink Dolphin">
      <img
        src={ITEM_DETAILS["Pink Dolphin"].image}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 5}px`,
        }}
        className="absolute"
        alt="Pink Dolphin"
      />
    </SFTDetailPopover>
  );
};
