import Decimal from "decimal.js-light";
import type { GameState, InventoryItemName } from "./game";

export type SculptureName = "Salt Sculpture";

export const SALT_SCULPTURE_MAX_LEVEL = 6;

export const SALT_SCULPTURE_UPGRADES: Record<
  number,
  {
    coins: number;
    ingredients: Partial<Record<InventoryItemName, Decimal>>;
  }
> = {
  2: {
    coins: 0,
    ingredients: {
      "Refined Salt": new Decimal(45),
      "Capsule Bait": new Decimal(10),
    },
  },
  3: {
    coins: 500,
    ingredients: {
      "Refined Salt": new Decimal(60),
      "Capsule Bait": new Decimal(10),
      "Umbrella Bait": new Decimal(10),
    },
  },
  4: {
    coins: 1000,
    ingredients: {
      "Refined Salt": new Decimal(70),
      "Greenhouse Glow": new Decimal(5),
      "Greenhouse Goodie": new Decimal(5),
    },
  },
  5: {
    coins: 1500,
    ingredients: {
      "Refined Salt": new Decimal(85),
      "Sproutroot Surprise": new Decimal(10),
      "Turbofruit Mix": new Decimal(10),
    },
  },
  6: {
    coins: 2000,
    ingredients: {
      "Refined Salt": new Decimal(100),
      "Crimson Baitfish": new Decimal(10),
    },
  },
};

export const SALT_SCULPTURE_BUFFS: Record<number, string> = {
  1: "-5% salt charge replenishment time",
  2: "+4% Prime Aging chance",
  3: "+1 max salt harvest cap per node",
  4: "-10% Salt Rake coin cost",
  5: "+5% Aging Rack speed",
  6: "+1 max salt harvest cap per node",
};

export function getSaltSculptureLevel(state: GameState): number {
  return state.sculptures?.["Salt Sculpture"]?.level ?? 0;
}
