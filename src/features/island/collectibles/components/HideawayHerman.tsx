import React from "react";

import hideawayHerman from "assets/decorations/hideaway_herman.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const HideawayHerman: React.FC = () => {
  return (
    <SFTDetailPopover name="Hideaway Herman">
      <>
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 17}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
        >
          <img
            src={hideawayHerman}
            style={{
              width: `${PIXEL_SCALE * 17}px`,
              bottom: `${PIXEL_SCALE * 0}px`,
            }}
            className="absolute"
            alt="Hideaway Herman"
          />
        </div>
      </>
    </SFTDetailPopover>
  );
};
