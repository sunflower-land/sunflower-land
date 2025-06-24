import React from "react";

import jellyfish from "assets/fish/jellyfish.webp";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Jellyfish: React.FC = () => {
  return (
    <SFTDetailPopover name="Jellyfish">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: `${PIXEL_SCALE * 19}px`,
        }}
      >
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 20}px`,
            bottom: `-${PIXEL_SCALE * 1.5}px`,
          }}
          className="absolute"
        />
        <img src={jellyfish} className="w-full" alt="Jellyfish" />
      </div>
    </SFTDetailPopover>
  );
};
