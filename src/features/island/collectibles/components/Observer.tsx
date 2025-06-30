import React from "react";

import observer from "assets/decorations/observer.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Observer: React.FC = () => {
  return (
    <SFTDetailPopover name="Observer">
      <>
        <img
          src={observer}
          style={{
            width: `${PIXEL_SCALE * 17}px`,
          }}
          className="absolute left-1/2 -translate-x-1/2 bottom-0"
          alt="Observer"
        />
      </>
    </SFTDetailPopover>
  );
};
