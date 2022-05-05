import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Bakery } from "features/farming/bakery/Bakery";
import { Blacksmith } from "features/farming/blacksmith/Blacksmith";
import { Shop } from "features/farming/shop/Shop";
import { Mail } from "features/farming/mail/Mail";
import { Section } from "lib/utils/hooks/useScrollIntoView";

import { GoblinVillageEntry } from "./components/GoblinVillageEntry";
import { TownHall } from "../townHall/TownHall";

export const Town: React.FC = () => {
  return (
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
      <Mail />
      <TownHall />

      <GoblinVillageEntry />
    </div>
  );
};
