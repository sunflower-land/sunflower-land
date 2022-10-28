import React from "react";
import deli from "assets/buildings/deli.png";

import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { PIXEL_SCALE } from "features/game/lib/constants";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

export const Deli: React.FC<Props> = () => {
  return (
    <img
      src={deli}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: 0,
        left: 0,
      }}
    />
  );
};
