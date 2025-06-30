import React from "react";
import prismPetal from "assets/flowers/prism_petal.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PrismPetal: React.FC = () => {
  return (
    <SFTDetailPopover name="Prism Petal">
      <>
        <img
          src={prismPetal}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Prism Petal"
        />
      </>
    </SFTDetailPopover>
  );
};
