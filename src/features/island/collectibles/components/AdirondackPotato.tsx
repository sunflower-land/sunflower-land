import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";

export const AdirondackPotato: React.FC<CollectibleProps> = () => {
  return (
    <div className="absolute bottom-0">
      <img src={SUNNYSIDE.sfts.adirondackPotato} alt="Adirondack Potato" />
    </div>
  );
};
