import React from "react";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "src/assets/sunnyside";

export const WhiteCarrot: React.FC<CollectibleProps> = (props) => {
  return (
    <div className="absolute bottom-0">
      <img src={SUNNYSIDE.sfts.whiteCarrot} alt="White Carrot" />
    </div>
  );
};
