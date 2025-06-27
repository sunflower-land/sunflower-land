import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";

export const GoldenHelios: React.FC<CollectibleProps> = () => {
  return (
    <div className="absolute bottom-0">
      <img src={SUNNYSIDE.sfts.goldenHelios} alt="Golden Helios" />
    </div>
  );
};
