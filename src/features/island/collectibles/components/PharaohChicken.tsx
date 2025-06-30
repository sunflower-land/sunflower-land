import React from "react";

import pharaohChicken from "assets/animals/chickens/pharaoh_chicken.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PharaohChicken: React.FC = () => {
  return (
    <SFTDetailPopover name="Pharaoh Chicken">
      <>
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 17}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        >
          <img
            src={pharaohChicken}
            style={{
              width: `${PIXEL_SCALE * 17}px`,
            }}
            alt="Pharaoh Chicken"
          />
        </div>
      </>
    </SFTDetailPopover>
  );
};
