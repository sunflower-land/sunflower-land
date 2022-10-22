import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section } from "lib/utils/hooks/useScrollIntoView";

import { GoblinVillageEntry } from "./components/GoblinVillageEntry";
//events
import { HalloweenBakery } from "features/halloween/bakery/Bakery";
import { HalloweenCakeStall } from "features/halloween/cakeStall/CakeStall";
import { HalloweenShop } from "features/halloween/shop/Shop";
import { HalloweenTownHall } from "features/halloween/townHall/TownHall";
import { HalloweenBlacksmith } from "features/halloween/blacksmith/Blacksmith";
import { HalloweenMail } from "features/halloween/mail/Mail";

export const HalloweenTown: React.FC = () => {
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
      <HalloweenShop />
      <HalloweenBakery />
      <HalloweenCakeStall />
      <HalloweenBlacksmith />
      <HalloweenMail />
      <HalloweenTownHall />
      {/*<Salesman/>*/}
      <GoblinVillageEntry />
    </div>
  );
};
