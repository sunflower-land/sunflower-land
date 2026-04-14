import React from "react";

import goldenCauliflower from "assets/sfts/golden_cauliflower.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const GoldenCauliflower: React.FC = () => {
  return (
    <SFTDetailPopover name="Golden Cauliflower">
      <img
        src={goldenCauliflower}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 32}px`,
        }}
        alt="Golden Cauliflower"
      />
    </SFTDetailPopover>
  );
};
