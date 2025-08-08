import Decimal from "decimal.js-light";
import { Decoration, getKeys } from "./decorations";
import { GameState, HelpedFarm, InventoryItemName } from "./game";
import cloneDeep from "lodash.clonedeep";
import { hasFeatureAccess } from "lib/flags";
import { FARM_GARBAGE } from "./clutter";

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

export const WORKBENCH_MONUMENTS: (
  game: GameState,
) => Record<WorkbenchMonumentName, LandscapingMonument> = (game) => {
  const hasCheersV2 = hasFeatureAccess(game, "CHEERS_V2");

  return {
    ...LOVE_CHARM_MONUMENTS,
    "Big Orange": {
      name: "Big Orange",
      description: "",
      coins: 0,
      ingredients: {
        Gem: new Decimal(hasCheersV2 ? 500 : 100),
      },
    },
    "Big Apple": {
      name: "Big Apple",
      description: "",
      coins: 0,
      ingredients: {
        Gem: new Decimal(hasCheersV2 ? 100 : 200),
      },
    },
    "Big Banana": {
      name: "Big Banana",
      description: "",
      coins: 0,
      ingredients: {
        Gem: new Decimal(hasCheersV2 ? 500 : 300),
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
        Gem: new Decimal(hasCheersV2 ? 500 : 100),
      },
    },
  } as Record<WorkbenchMonumentName, LandscapingMonument>;
};

export type MonumentName =
  | WorkbenchMonumentName
  | LoveCharmMonumentName
  | MegastoreMonumentName;

export const REQUIRED_CHEERS: (
  game: GameState,
) => Record<MonumentName, number> = (game) => {
  const hasCheersV2 = hasFeatureAccess(game, "CHEERS_V2");

  return {
    "Big Orange": hasCheersV2 ? 25 : 50,
    "Big Apple": hasCheersV2 ? 50 : 200,
    "Big Banana": hasCheersV2 ? 200 : 1000,
    "Basic Cooking Pot": 10,
    "Expert Cooking Pot": 50,
    "Advanced Cooking Pot": 100,
    "Farmer's Monument": 100,
    "Woodcutter's Monument": 1000,
    "Miner's Monument": 10000,
    "Teamwork Monument": 100,
  };
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
    rewards["Big Orange"] = { amount: 1, item: "Giant Orange" };
    rewards["Big Apple"] = { amount: 1, item: "Giant Apple" };
    rewards["Big Banana"] = { amount: 1, item: "Giant Banana" };

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
      0) >= REQUIRED_CHEERS(gameState)["Farmer's Monument"]
  ) {
    base += amount * 0.01;
  }
  if (
    (gameState.socialFarming.villageProjects["Woodcutter's Monument"]?.cheers ??
      0) >= REQUIRED_CHEERS(gameState)["Woodcutter's Monument"]
  ) {
    base += amount * 0.03;
  }
  if (
    (gameState.socialFarming.villageProjects["Miner's Monument"]?.cheers ??
      0) >= REQUIRED_CHEERS(gameState)["Miner's Monument"]
  ) {
    base += amount * 0.06;
  }
  if (
    (gameState.socialFarming.villageProjects["Teamwork Monument"]?.cheers ??
      0) >= REQUIRED_CHEERS(gameState)["Teamwork Monument"]
  ) {
    base += amount * 0.1;
  }

  return base;
}

export function isHelpComplete({ game }: { game: GameState }) {
  return getHelpRequired({ game }) <= 0;
}

// Returns a count of help tasks needed on the farm
export function getHelpRequired({ game }: { game: GameState }) {
  const clutter = getKeys(game.socialFarming.clutter?.locations ?? {}).filter(
    (id) => {
      const type = game.socialFarming.clutter?.locations[id].type;

      // There are no garbage items left
      return type && type in FARM_GARBAGE;
    },
  );

  const pendingProjects = getKeys(game.socialFarming.villageProjects).filter(
    (project) => {
      const hasHelped = !!game.socialFarming.villageProjects[project]?.helpedAt;

      const isComplete =
        REQUIRED_CHEERS(game)[project] <=
        (game.socialFarming.villageProjects[project]?.cheers ?? 0);

      const isProjectPlaced =
        game.collectibles?.[project]?.some((item) => !!item.coordinates) ??
        false;

      if (!isProjectPlaced) return;

      return !hasHelped && !isComplete;
    },
  );

  return clutter.length + pendingProjects.length;
}

export function hasHelpedFarmToday({
  game,
  farmId,
}: {
  game: GameState;
  farmId: number;
}) {
  const helpedAt = game.socialFarming?.helped?.[farmId]?.helpedAt ?? 0;

  return (
    new Date(helpedAt).toISOString().slice(0, 10) ===
    new Date().toISOString().slice(0, 10)
  );
}

/**
 * If the last help was older than the previous day, the streak expires and returns 0.
 */
export function getHelpStreak({
  farm,
  now = Date.now(),
}: {
  farm?: HelpedFarm;
  now?: number;
}) {
  if (!farm?.streak?.updatedAt) return 0;

  const streakDate = new Date(farm.streak.updatedAt);
  const currentDate = new Date(now);

  // Calculate the difference in days
  const timeDiff = currentDate.getTime() - streakDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  // Streak expires if it's 2 or more days old (older than previous day)
  if (daysDiff >= 2) return 0;

  return farm.streak.count;
}
