import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PurpleCauliflower: React.FC<CollectibleProps> = (props) => {
  return (
    <SFTDetailPopover name="Purple Cauliflower">
      <div className="absolute bottom-0">
        <img src={SUNNYSIDE.sfts.purpleCauliflower} alt="Purple Cauliflower" />
      </div>
    </SFTDetailPopover>
  );
};
