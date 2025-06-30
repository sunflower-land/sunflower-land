import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const AdirondackPotato: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Adirondack Potato">
      <div className="absolute bottom-0">
        <img src={SUNNYSIDE.sfts.adirondackPotato} alt="Adirondack Potato" />
      </div>
    </SFTDetailPopover>
  );
};
