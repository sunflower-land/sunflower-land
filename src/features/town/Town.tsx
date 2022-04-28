import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Bank } from "features/bank/Bank";
import { Bakery } from "features/bakery/Bakery";
import { Blacksmith } from "features/blacksmith/Blacksmith";
import { Market } from "features/crops/components/Market";
import { WishingWell } from "features/wishingWell/WishingWell";
import { Mail } from "features/mail/Mail";
import { Section } from "lib/utils/hooks/useScrollIntoView";

import goblinCarry from "assets/npcs/goblin_carry.gif";
import { GoblinTownEntry } from "./components/GoblinTownEntry";

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
      <Market />
      <Bank />
      <Bakery />
      <Blacksmith />
      <WishingWell />
      <Mail />

      <GoblinTownEntry />
    </div>
  );
};
