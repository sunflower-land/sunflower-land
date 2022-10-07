import React from "react";

import { GRID_WIDTH_PX } from "../../lib/constants";
import { Inventory } from "../../types/game";

import nancy from "assets/nfts/nancy.png";
import scarecrow from "assets/nfts/scarecrow.png";
import kuebiko from "assets/nfts/kuebiko.gif";

// Only show 1 scarecrow at a time
export const Scarecrows: React.FC<{ inventory: Inventory }> = ({
  inventory,
}) => {
  if (inventory.Kuebiko) {
    return (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 2}px`,
        }}
        src={kuebiko}
        alt="Scarecrow"
      />
    );
  }

  if (inventory.Scarecrow) {
    return (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.3}px`,
        }}
        src={scarecrow}
        alt="Scarecrow"
      />
    );
  }

  if (inventory.Nancy) {
    return (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.2}px`,
        }}
        src={nancy}
        alt="Scarecrow"
      />
    );
  }

  return null;
};
