import React from "react";

import deepSeaSlugTrophy from "assets/fish/deep_sea_slug_trophy.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const DeepSeaSlug: React.FC = () => {
  return (
    <SFTDetailPopover name="Deep Sea Slug">
      <>
        <img
          src={deepSeaSlugTrophy}
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Deep Sea Slug"
        />
      </>
    </SFTDetailPopover>
  );
};
