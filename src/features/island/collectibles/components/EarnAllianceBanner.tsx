import React from "react";

import banner from "assets/sfts/earn_alliance_banner.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const EarnAllianceBanner: React.FC = () => {
  return (
    <SFTDetailPopover name="Earn Alliance Banner">
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          top: `${PIXEL_SCALE * -3}px`,
          left: `${PIXEL_SCALE * -1}px`,
        }}
      >
        <img
          src={banner}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
          }}
          alt="Earn Alliance Banner"
        />
      </div>
    </SFTDetailPopover>
  );
};
