import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GoldenHelios: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Golden Helios">
      <div className="absolute bottom-0">
        <img src={SUNNYSIDE.sfts.goldenHelios} alt="Golden Helios" />
      </div>
    </SFTDetailPopover>
  );
};
