import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const WhiteCarrot: React.FC<CollectibleProps> = (props) => {
  return (
    <SFTDetailPopover name="White Carrot">
      <div className="absolute bottom-0">
        <img src={SUNNYSIDE.sfts.whiteCarrot} alt="White Carrot" />
      </div>
    </SFTDetailPopover>
  );
};
