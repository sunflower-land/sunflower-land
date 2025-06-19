import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";

export const Chiogga: React.FC<CollectibleProps> = () => {
  return (
    <div className="absolute bottom-0">
      <img src={SUNNYSIDE.sfts.chiogga} alt="Chiogga" />
    </div>
  );
};
