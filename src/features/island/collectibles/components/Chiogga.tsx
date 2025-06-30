import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Chiogga: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Chiogga">
      <div className="absolute bottom-0">
        <img src={SUNNYSIDE.sfts.chiogga} alt="Chiogga" />
      </div>
    </SFTDetailPopover>
  );
};
