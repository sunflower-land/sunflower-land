import React from "react";

import tunnelMole from "assets/nfts/tunnel_mole.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const TunnelMole: React.FC = () => {
  return (
    <img
      src={tunnelMole}
      style={{
        width: `${PIXEL_SCALE * 24}px`,
      }}
      alt="Tunnel mole"
    />
  );
};
