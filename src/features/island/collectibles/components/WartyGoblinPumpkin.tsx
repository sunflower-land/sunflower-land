import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const WartyGoblinPumpkin: React.FC<CollectibleProps> = (props) => {
  return (
    <SFTDetailPopover name="Warty Goblin Pumpkin">
      <div className="absolute bottom-0">
        <img
          src={SUNNYSIDE.sfts.wartyGoblinPumpkin}
          alt="Warty Goblin Pumpkin"
        />
      </div>
    </SFTDetailPopover>
  );
};
