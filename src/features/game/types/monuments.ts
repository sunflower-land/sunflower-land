import Decimal from "decimal.js-light";
import { Decoration } from "./decorations";
import { GameState, InventoryItemName } from "./game";
import cloneDeep from "lodash.clonedeep";
import { hasFeatureAccess } from "lib/flags";

type LoveCharmMonumentName =
  | "Farmer's Monument"
  | "Miner's Monument"
  | "Woodcutter's Monument";

type MegastoreMonumentName = "Teamwork Monument";

export type WorkbenchMonumentName =
  | LoveCharmMonumentName
  | "Big Orange"
  | "Big Apple"
  | "Big Banana"
  | "Basic Cooking Pot"
  | "Expert Cooking Pot"
  | "Advanced Cooking Pot";

type LoveCharmMonument = Omit<Decoration, "name"> & {
  name: LoveCharmMonumentName;
};

type MegastoreMonument = Omit<Decoration, "name"> & {
  name: MegastoreMonumentName;
};

export type LandscapingMonument = Omit<Decoration, "name"> & {
  name: WorkbenchMonumentName;
};

export type Monument =
  | LoveCharmMonument
  | LandscapingMonument
  | MegastoreMonument;

export const MEGASTORE_MONUMENTS: Record<
  MegastoreMonumentName,
  MegastoreMonument
> = {
  "Teamwork Monument": {
    name: "Teamwork Monument",
    description: "",
    coins: 0,
    ingredients: {},
  },
};

export const LOVE_CHARM_MONUMENTS: Record<
  LoveCharmMonumentName,
  LoveCharmMonument
> = {
  "Farmer's Monument": {
    name: "Farmer's Monument",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(100),
    },
  },
  "Woodcutter's Monument": {
    name: "Woodcutter's Monument",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(200),
    },
  },
  "Miner's Monument": {
    name: "Miner's Monument",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(300),
    },
  },
};

export const WORKBENCH_MONUMENTS: Record<
  WorkbenchMonumentName,
  LandscapingMonument
> = {
  ...LOVE_CHARM_MONUMENTS,
  "Big Orange": {
    name: "Big Orange",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(100),
    },
  },
  "Big Apple": {
    name: "Big Apple",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(200),
    },
  },
  "Big Banana": {
    name: "Big Banana",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(300),
    },
  },
  "Basic Cooking Pot": {
    name: "Basic Cooking Pot",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(10),
    },
  },
  "Expert Cooking Pot": {
    name: "Expert Cooking Pot",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(50),
    },
  },
  "Advanced Cooking Pot": {
    name: "Advanced Cooking Pot",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(100),
    },
  },
};

export type MonumentName =
  | WorkbenchMonumentName
  | LoveCharmMonumentName
  | MegastoreMonumentName;

export const REQUIRED_CHEERS: Record<MonumentName, number> = {
  "Big Orange": 50,
  "Big Apple": 200,
  "Big Banana": 1000,
  "Basic Cooking Pot": 10,
  "Expert Cooking Pot": 50,
  "Advanced Cooking Pot": 100,
  "Farmer's Monument": 100,
  "Woodcutter's Monument": 1000,
  "Miner's Monument": 10000,
  "Teamwork Monument": 100,
};

const REWARD_ITEMS: Partial<
  Record<
    MonumentName,
    {
      item: InventoryItemName;
      amount: number;
    }
  >
> = {
  "Big Orange": {
    item: "Love Charm",
    amount: 200,
  },
  "Big Apple": {
    item: "Love Charm",
    amount: 400,
  },
  "Big Banana": {
    item: "Love Charm",
    amount: 600,
  },
  "Basic Cooking Pot": {
    item: "Bronze Food Box",
    amount: 1,
  },
  "Expert Cooking Pot": {
    item: "Silver Food Box",
    amount: 1,
  },
  "Advanced Cooking Pot": {
    item: "Gold Food Box",
    amount: 1,
  },
};

export function getMonumentRewards({
  state,
  monument,
}: {
  state: GameState;
  monument: MonumentName;
}) {
  const rewards = cloneDeep(REWARD_ITEMS);

  if (hasFeatureAccess(state, "CHEERS_V2")) {
    rewards["Big Orange"] = { amount: 1, item: "Bronze Love Box" };
    rewards["Big Apple"] = { amount: 1, item: "Silver Love Box" };
    rewards["Big Banana"] = { amount: 1, item: "Gold Love Box" };

    // Double Food Box Rewards
    rewards["Basic Cooking Pot"] = { amount: 2, item: "Bronze Food Box" };
    rewards["Expert Cooking Pot"] = { amount: 2, item: "Silver Food Box" };
    rewards["Advanced Cooking Pot"] = { amount: 2, item: "Gold Food Box" };
  }

  return rewards;
}

export function getMonumentBoostedAmount({
  gameState,
  amount,
}: {
  gameState: GameState;
  amount: number;
}) {
  let base = amount;

  if (
    (gameState.socialFarming.villageProjects["Farmer's Monument"]?.cheers ??
      0) >= REQUIRED_CHEERS["Farmer's Monument"]
  ) {
    base += amount * 0.01;
  }
  if (
    (gameState.socialFarming.villageProjects["Woodcutter's Monument"]?.cheers ??
      0) >= REQUIRED_CHEERS["Woodcutter's Monument"]
  ) {
    base += amount * 0.03;
  }
  if (
    (gameState.socialFarming.villageProjects["Miner's Monument"]?.cheers ??
      0) >= REQUIRED_CHEERS["Miner's Monument"]
  ) {
    base += amount * 0.06;
  }
  if (
    (gameState.socialFarming.villageProjects["Teamwork Monument"]?.cheers ??
      0) >= REQUIRED_CHEERS["Teamwork Monument"]
  ) {
    base += amount * 0.1;
  }

  return base;
}
