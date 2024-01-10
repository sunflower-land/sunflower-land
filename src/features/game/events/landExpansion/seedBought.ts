import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";

import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

import { Bumpkin, GameState, Inventory } from "features/game/types/game";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getBumpkinLevel } from "features/game/lib/level";
import { Seed, SeedName, SEEDS } from "features/game/types/seeds";

export type SeedBoughtAction = {
  type: "seed.bought";
  item: SeedName;
  amount: number;
};

export function getBuyPrice(
  name: SeedName,
  seed: Seed,
  inventory: Inventory,
  game: GameState,
  bumpkin: Bumpkin
) {
  const { equipped } = bumpkin;
  const { secondaryTool } = equipped;
  if (isCollectibleBuilt({ name: "Kuebiko", game })) {
    return new Decimal(0);
  }

  if (secondaryTool === "Sunflower Shield" && name === "Sunflower Seed") {
    return new Decimal(0);
  }

  let price = seed.sfl;

  //LEGACY SKILL Contributor Artist Skill
  if (price && inventory.Artist?.gte(1)) {
    price = price.mul(0.9);
  }

  return price;
}

type Options = {
  state: Readonly<GameState>;
  action: SeedBoughtAction;
};

export function seedBought({ state, action }: Options) {
  const stateCopy = cloneDeep(state);
  const { item, amount } = action;

  if (!(item in SEEDS())) {
    throw new Error("This item is not a seed");
  }

  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("Bumpkin not found");
  }

  const userBumpkinLevel = getBumpkinLevel(stateCopy.bumpkin?.experience ?? 0);
  const seed = SEEDS()[item];
  const requiredSeedLevel = seed.bumpkinLevel ?? 0;

  if (userBumpkinLevel < requiredSeedLevel) {
    throw new Error("Inadequate level");
  }

  if (amount < 1) {
    throw new Error("Invalid amount");
  }

  if (stateCopy.stock[item]?.lt(amount)) {
    throw new Error("Not enough stock");
  }

  const price = getBuyPrice(
    item,
    seed,
    stateCopy.inventory,
    stateCopy,
    stateCopy.bumpkin as Bumpkin
  );
  const totalExpenses = price?.mul(amount);

  if (totalExpenses && stateCopy.balance.lessThan(totalExpenses)) {
    throw new Error("Insufficient tokens");
  }

  const oldAmount = stateCopy.inventory[item] ?? new Decimal(0);

  bumpkin.activity = trackActivity(
    "SFL Spent",
    bumpkin?.activity,
    totalExpenses ?? new Decimal(0)
  );
  bumpkin.activity = trackActivity(
    `${item} Bought`,
    bumpkin?.activity,
    new Decimal(amount)
  );

  return {
    ...stateCopy,
    balance: totalExpenses
      ? stateCopy.balance.sub(totalExpenses)
      : stateCopy.balance,
    inventory: {
      ...stateCopy.inventory,
      [item]: oldAmount.add(amount) as Decimal,
    },
    stock: {
      ...stateCopy.stock,
      [item]: stateCopy.stock[item]?.minus(amount) as Decimal,
    },
  };
}
