import React from "react";

import image from "assets/decorations/chestnut_fungi_stool.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const ChestnutFungiStool: React.FC = () => {
  return (
    <SFTDetailPopover name="Chestnut Fungi Stool">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 2}px`,
          }}
          className="absolute"
          alt="Chestnut Stool"
        />
      </>
    </SFTDetailPopover>
  );
};
