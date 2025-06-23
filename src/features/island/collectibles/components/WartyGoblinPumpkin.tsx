import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";

export const WartyGoblinPumpkin: React.FC<CollectibleProps> = (props) => {
  return (
    <div className="absolute bottom-0">
      <img src={SUNNYSIDE.sfts.wartyGoblinPumpkin} alt="Warty Goblin Pumpkin" />
    </div>
  );
};
