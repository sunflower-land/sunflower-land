import React from "react";

import walrus from "assets/sfts/walrus.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Walrus: React.FC = () => {
  return (
    <SFTDetailPopover name="Walrus">
      <>
        <img
          src={walrus}
          style={{
            width: `${PIXEL_SCALE * 25}px`,
            bottom: `${PIXEL_SCALE * 4}px`,
          }}
          className="absolute left-1/2 -translate-x-1/2"
          alt="Walrus"
        />
      </>
    </SFTDetailPopover>
  );
};
