import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CONFIG } from "lib/config";

import shadow from "assets/npcs/shadow.png";
import { TypeTrait } from "features/game/types/buds";
import classNames from "classnames";

const imageDomain = CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

type Props = {
  id: string;
  type: TypeTrait;
};

export const Bud: React.FC<Props> = ({ id, type }) => {
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
        className={classNames("absolute w-full -translate-x-1/4", {
          "top-1": type === "Retreat",
        })}
        alt={`Bud ${id}`}
      />
    </div>
  );
};
