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
    "Beach Umbrella": new Decimal(1),
    "Abandoned Bear": new Decimal(1),
    "Acorn House": new Decimal(1),
    "Adirondack Potato": new Decimal(1),
    "Bear Trap": new Decimal(1),
    "Bear Shrine": new Decimal(1),
    "Rich Bear": new Decimal(1),
    "Angel Bear": new Decimal(1),
    "Aging Shed": new Decimal(1),
    "Basic Land": new Decimal(30),
  },
  buildings: {
    ...INITIAL_FARM.buildings,
    "Aging Shed": [
      {
        id: "aging-shed-1",
        coordinates: { x: -5, y: -3 },
        createdAt: 0,
        readyAt: 0,
      },
    ],
  },
  agingShed: {
    ...INITIAL_FARM.agingShed,
    level: 5,
  },
  saltFarm: {
    level: 4,
    nodes: Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [
        String(i),
        {
          createdAt: 0,
          salt: {
            storedCharges: 3,
            nextChargeAt: 0,
          },
        },
      ]),
    ),
  },
  farmActivity: {
    "welcome Bonus Claimed": 1, // Skip welcome screen
  },
};
