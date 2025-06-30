import React from "react";

import krakenHead from "assets/sfts/kraken_head.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const KrakenHead: React.FC = () => {
  return (
    <SFTDetailPopover name="Kraken Head">
      <img
        src={krakenHead}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 -translate-x-1/2"
        alt="Kraken Head"
      />
    </SFTDetailPopover>
  );
};
