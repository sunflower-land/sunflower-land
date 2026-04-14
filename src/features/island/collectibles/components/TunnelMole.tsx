import React from "react";

import tunnelMole from "assets/sfts/tunnel_mole.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const TunnelMole: React.FC = () => {
  return (
    <SFTDetailPopover name="Tunnel Mole">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 20}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          right: `${PIXEL_SCALE * -2}px`,
        }}
      >
        <img
          src={tunnelMole}
          style={{
            width: `${PIXEL_SCALE * 20}px`,
          }}
          alt="Tunnel mole"
        />
      </div>
    </SFTDetailPopover>
  );
};
