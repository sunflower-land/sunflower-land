import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CONFIG } from "lib/config";

import shadow from "assets/npcs/shadow.png";

const imageDomain = CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

type Props = {
  id: string;
};

export const Bud: React.FC<Props> = ({ id }) => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 32}px`,
        height: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${-PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={shadow}
        style={{
          width: `${16 * PIXEL_SCALE}px`,
          bottom: 0,
        }}
        className="absolute"
      />
      <img
        src={`https://${imageDomain}.sunflower-land.com/images/${id}.webp`}
        className="absolute w-full -translate-x-1/4"
        alt={`Bud ${id}`}
      />
    </div>
  );
};
