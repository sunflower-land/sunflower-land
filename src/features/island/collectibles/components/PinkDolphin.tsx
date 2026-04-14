import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
import trophy from "assets/fish/pink_dolphin_trophy.webp";

export const PinkDolphin: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Pink Dolphin">
      <img
        src={trophy}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Pink Dolphin"
      />
    </SFTDetailPopover>
  );
};
