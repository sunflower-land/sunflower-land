import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import capybara from "assets/sfts/capybara.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Capybara: React.FC = () => {
  return (
    <SFTDetailPopover name="Capybara">
      <img
        src={capybara}
        style={{
          width: `${PIXEL_SCALE * 29}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Capybara"
      />
    </SFTDetailPopover>
  );
};
