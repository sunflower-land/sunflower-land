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
      "Refined Salt": new Decimal(10),
      Earthworm: new Decimal(10),
    },
  },
  3: {
    coins: 500,
    ingredients: {
      "Refined Salt": new Decimal(40),
      Earthworm: new Decimal(10),
      Grub: new Decimal(10),
    },
  },
  4: {
    coins: 1000,
    ingredients: {
      "Refined Salt": new Decimal(75),
      "Greenhouse Glow": new Decimal(25),
      "Greenhouse Goodie": new Decimal(25),
    },
  },
  5: {
    coins: 1500,
    ingredients: {
      "Refined Salt": new Decimal(120),
      "Sproutroot Surprise": new Decimal(10),
      "Turbofruit Mix": new Decimal(10),
    },
  },
  6: {
    coins: 2000,
    ingredients: {
      "Refined Salt": new Decimal(200),
      "Red Wiggler": new Decimal(10),
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

export function getMaxStoredSaltCharges(sculptureLevel: number): number {
  let max = 3;
  if (sculptureLevel >= 3) max += 1;
  if (sculptureLevel >= 6) max += 1;
  return max;
}
