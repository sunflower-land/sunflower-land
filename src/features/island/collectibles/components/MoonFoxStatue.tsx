import React from "react";

import moonFoxStatue from "assets/sfts/moon_fox_statue.webp";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
import { CollectibleProps } from "../Collectible";

export const MoonFoxStatue: React.FC<CollectibleProps> = () => {
  return (
    <SFTDetailPopover name="Moon Fox Statue">
      <div
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={shadow}
          alt="Shadow"
          className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            bottom: `${PIXEL_SCALE * -1}px`,
          }}
        />
        <img
          src={moonFoxStatue}
          alt="Moon Fox Statue"
          className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
        />
      </div>
    </SFTDetailPopover>
  );
};
