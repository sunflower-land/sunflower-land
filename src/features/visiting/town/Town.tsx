import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Section } from "lib/utils/hooks/useScrollIntoView";
import { TownHall } from "features/farming/townHall/TownHall";
import { Shop } from "../shop/Shop";
import { Bakery } from "../bakery/Bakery";
import { Blacksmith } from "../blacksmith/Blacksmith";

export const Town: React.FC = () => (
  <div
    id={Section.Town}
    className="z-10 absolute"
    // TODO some sort of coordinate system
    style={{
      width: `${GRID_WIDTH_PX * 34.3}px`,
      height: `${GRID_WIDTH_PX * 9}px`,
      right: 0,
      top: `calc(50% - ${GRID_WIDTH_PX * 18}px)`,
    }}
  >
    <Shop />
    <Bakery />
    <Blacksmith />
    <TownHall />
  </div>
);
