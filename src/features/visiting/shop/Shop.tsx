import React from "react";

import shop from "assets/buildings/shop_building.png";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section } from "lib/utils/hooks/useScrollIntoView";

export const Shop: React.FC = () => (
  <div
    id={Section.Shop}
    className="absolute"
    style={{
      width: `${GRID_WIDTH_PX * 3}px`,
      left: `${GRID_WIDTH_PX * 3}px`,
      top: `${GRID_WIDTH_PX * 5}px`,
    }}
  >
    <img src={shop} alt="shop" className="w-full" />
  </div>
);
