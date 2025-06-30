import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const MysteriousParsnip: React.FC = () => {
  return (
    <SFTDetailPopover name="Mysterious Parsnip">
      <img
        src={ITEM_DETAILS["Mysterious Parsnip"].image}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Mysterious Parsnip"
      />
    </SFTDetailPopover>
  );
};
