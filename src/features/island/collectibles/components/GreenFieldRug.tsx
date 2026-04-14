import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import greenFieldRug from "assets/sfts/green_field_rug.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GreenFieldRug: React.FC = () => {
  return (
    <SFTDetailPopover name="Green Field Rug">
      <div
        className="absolute flex justify-center items-center"
        style={{
          width: `${PIXEL_SCALE * 48}px`,
          height: `${PIXEL_SCALE * 49}px`,
        }}
      >
        <img
          src={greenFieldRug}
          className="w-full h-full"
          alt="Green Field Rug"
        />
      </div>
    </SFTDetailPopover>
  );
};
