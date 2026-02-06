import React from "react";

import jellyfish from "assets/fish/jellyfish_trophy.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Jellyfish: React.FC = () => {
  return (
    <SFTDetailPopover name="Jellyfish">
      <img
        src={jellyfish}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Jellyfish"
      />
    </SFTDetailPopover>
  );
};
