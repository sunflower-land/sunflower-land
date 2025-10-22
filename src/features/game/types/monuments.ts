import Decimal from "decimal.js-light";
import { Decoration, getKeys } from "./decorations";
import { GameState, InventoryItemName } from "./game";
import { FARM_GARBAGE } from "./clutter";
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
  level?: number;
};

type MegastoreMonument = Omit<Decoration, "name"> & {
  name: MegastoreMonumentName;
};

export type LandscapingMonument = Omit<Decoration, "name"> & {
  name: WorkbenchMonumentName;
  level?: number;
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
    level: 10,
  },
  "Woodcutter's Monument": {
    name: "Woodcutter's Monument",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(200),
    },
    level: 20,
  },
  "Miner's Monument": {
    name: "Miner's Monument",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(300),
    },
    level: 50,
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
    coins: 500,
    ingredients: {},
    level: 16,
  },
  "Big Apple": {
    name: "Big Apple",
    description: "",
    coins: 1500,
    ingredients: {},
    level: 30,
  },
  "Big Banana": {
    name: "Big Banana",
    description: "",
    coins: 4000,
    level: 50,
    ingredients: {},
  },
  "Basic Cooking Pot": {
    name: "Basic Cooking Pot",
    description: "",
    coins: 0,
    ingredients: { Gem: new Decimal(10) },
    level: 20,
  },
  "Expert Cooking Pot": {
    name: "Expert Cooking Pot",
    description: "",
    coins: 0,
    ingredients: { Gem: new Decimal(50) },
    level: 40,
  },
  "Advanced Cooking Pot": {
    name: "Advanced Cooking Pot",
    description: "",
    coins: 0,
    ingredients: { Gem: new Decimal(500) },
    level: 60,
  },
};

export type MonumentName =
  | WorkbenchMonumentName
  | LoveCharmMonumentName
  | MegastoreMonumentName;

export const REQUIRED_CHEERS: Record<MonumentName, number> = {
  "Big Orange": 25,
  "Big Apple": 50,
  "Big Banana": 200,
  "Basic Cooking Pot": 10,
  "Expert Cooking Pot": 50,
  "Advanced Cooking Pot": 100,
  "Farmer's Monument": 100,
  "Woodcutter's Monument": 1000,
  "Miner's Monument": 10000,
  "Teamwork Monument": 100,
};

export const REWARD_ITEMS: Partial<
  Record<
    MonumentName,
    {
      item: InventoryItemName;
      amount: number;
    }
  >
> = {
  "Big Orange": {
    item: "Giant Orange",
    amount: 1,
  },
  "Big Apple": {
    item: "Giant Apple",
    amount: 1,
  },
  "Big Banana": {
    item: "Giant Banana",
    amount: 1,
  },
  "Basic Cooking Pot": {
    item: "Bronze Food Box",
    amount: 2,
  },
  "Expert Cooking Pot": {
    item: "Silver Food Box",
    amount: 2,
  },
  "Advanced Cooking Pot": {
    item: "Gold Food Box",
    amount: 2,
  },
};

export function isHelpComplete({
  game,
  visitorState,
}: {
  game: GameState;
  visitorState?: GameState;
}) {
  return getHelpRequired({ game, visitorState }) <= 0;
}

// Returns a count of help tasks needed on the farm
export function getHelpRequired({
  game,
  visitorState,
}: {
  game: GameState;
  visitorState?: GameState;
}) {
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
        REQUIRED_CHEERS[project] <=
        (game.socialFarming.villageProjects[project]?.cheers ?? 0);

      const isProjectPlaced =
        game.collectibles?.[project]?.some((item) => !!item.coordinates) ||
        game.home.collectibles?.[project]?.some((item) => !!item.coordinates) ||
        false;

      if (!isProjectPlaced) return;

      return !hasHelped && !isComplete;
    },
  );

  const pendingPets = getKeys(game.pets?.common ?? {}).filter((pet) => {
    const hasAccess = !!visitorState && hasFeatureAccess(visitorState, "PETS");
    if (!hasAccess) {
      return false;
    }

    const isPetPlaced =
      game.collectibles?.[pet]?.some((item) => !!item.coordinates) ||
      game.home.collectibles?.[pet]?.some((item) => !!item.coordinates) ||
      false;

    if (!isPetPlaced) return;

    const hasVisited = !!game.pets?.common?.[pet]?.visitedAt;
    return !hasVisited;
  });

  return clutter.length + pendingProjects.length + pendingPets.length;
}

export const RAFFLE_REWARDS: Partial<
  Record<
    MonumentName,
    {
      item: InventoryItemName;
      amount: number;
    }
  >
> = {
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
