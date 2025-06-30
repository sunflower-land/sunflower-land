import React from "react";

import banner from "assets/decorations/banners/spring_banner.gif";
import bannerShadow from "assets/decorations/banners/banner_shadow.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SpringBlossomBanner: React.FC = () => {
  return (
    <SFTDetailPopover name="Spring Blossom Banner">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          top: `${PIXEL_SCALE * -6}px`,
          left: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={banner}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
          alt="Spring Blossom Banner"
        />
        <img
          src={bannerShadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 4}px`,
          }}
          alt="Spring Blossom Banner Shadow"
        />
      </div>
    </SFTDetailPopover>
  );
};
