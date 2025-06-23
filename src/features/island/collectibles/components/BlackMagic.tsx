import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";

export const BlackMagic: React.FC<CollectibleProps> = () => {
  return (
    <div className="absolute bottom-0">
      <img src={SUNNYSIDE.sfts.blackMagic} alt="Black Magic" />
    </div>
  );
};
