import React from "react";

import banner from "assets/decorations/banners/creator_banner.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const CreatorBanner: React.FC = () => {
  return (
    <SFTDetailPopover name="Creator Banner">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          top: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={banner}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
          alt="Creator Banner"
        />
      </div>
    </SFTDetailPopover>
  );
};
