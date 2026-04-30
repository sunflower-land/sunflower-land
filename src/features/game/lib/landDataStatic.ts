/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import Decimal from "decimal.js-light";
import { GameState } from "../types/game";

import { INITIAL_FARM } from "./constants";

export const STATIC_OFFLINE_FARM: GameState = {
  ...INITIAL_FARM,
  inventory: {
    ...INITIAL_FARM.inventory,
    Shovel: new Decimal("1"),
    "Sand Shovel": new Decimal("36"),
    "Sand Drill": new Decimal("2"),
    "Petting Hand": new Decimal("1"),
    Brush: new Decimal("1"),
    "Potato Statue": new Decimal("1"),
    "Christmas Tree": new Decimal("1"),
    Scarecrow: new Decimal("1"),
    "Farm Cat": new Decimal("2"),
    Gnome: new Decimal("1"),
    "Chicken Coop": new Decimal("1"),
    "Gold Egg": new Decimal("1"),
    "Golden Cauliflower": new Decimal("1"),
    "Sunflower Rock": new Decimal("2"),
    "Goblin Crown": new Decimal("1"),
    Fountain: new Decimal("2"),
    Crate: new Decimal("1"),
    "Long Table": new Decimal("5"),
    "Large Podium": new Decimal("1"),
    "Super Totem": new Decimal(1),
  },
  farmActivity: {
    "welcome Bonus Claimed": 1, // Skip welcome screen
  },
};
