import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Section } from "lib/utils/hooks/useScrollIntoView";
import { HalloweenBlacksmith } from "../blacksmith/Blacksmith";
import { HalloweenBank } from "../bank/Bank";
import { HalloweenFarmer } from "../farmer/Farmer";
import { HalloweenWishingWell } from "../wishingWell/WishingWell";
import { Hud } from "src/features/goblins/hud/Hud";
import { Tailor } from "../tailor/Tailor";
import { Decorations } from "../Decorations";
import { GoblinMachineState } from "features/game/lib/goblinMachine";
import { AncientTree } from "../quest/AncientTree";
import { AncientRock } from "../quest/AncientRock";
import { HalloweenAncientDoor } from "../quest/AncientDoor";
import { HalloweenTrader } from "../trader/tradingPost/Trader";
import { HalloweenStorageHouse } from "../storageHouse/StorageHouse";
import { HalloweenWarTent } from "../warTent/WarTent";

interface Props {
  state: GoblinMachineState["value"];
}

export const HalloweenVillage: React.FC<Props> = () => {
  return (
    <div
      style={{
        width: `${GRID_WIDTH_PX * 25}px`,
        height: `${GRID_WIDTH_PX * 16.6}px`,
        left: `calc(50% - ${GRID_WIDTH_PX * 8}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 11.6}px)`,
      }}
      className="absolute"
    >
      {/* Navigation Center Point */}
      <span
        id={Section.GoblinVillage}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      <Hud />
      <HalloweenBlacksmith />
      <HalloweenBank />
      <HalloweenFarmer />
      <HalloweenWishingWell />
      <Tailor />
      <HalloweenStorageHouse />
      <Decorations />
      <AncientTree />
      <AncientRock />
      <HalloweenAncientDoor />
      <HalloweenTrader />
      <HalloweenWarTent />
    </div>
  );
};
