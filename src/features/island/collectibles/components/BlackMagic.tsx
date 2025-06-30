import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BlackMagic: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Black Magic">
      <div className="absolute bottom-0">
        <img src={SUNNYSIDE.sfts.blackMagic} alt="Black Magic" />
      </div>
    </SFTDetailPopover>
  );
};
