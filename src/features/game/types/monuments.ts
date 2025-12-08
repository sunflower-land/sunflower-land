import Decimal from "decimal.js-light";
import { Decoration, getKeys } from "./decorations";
import { GameState, InventoryItemName } from "./game";
import { ClutterName } from "./clutter";
import { PetName, PetNFTName } from "./pets";
import { isCollectibleBuilt } from "../lib/collectibleBuilt";

type HelpLimitMonumentName =
  | "Farmer's Monument"
  | "Miner's Monument"
  | "Woodcutter's Monument";

type MegastoreMonumentName = "Teamwork Monument" | "Cornucopia";

export type WorkbenchMonumentName =
  | HelpLimitMonumentName
  | "Big Orange"
  | "Big Apple"
  | "Big Banana"
  | "Basic Cooking Pot"
  | "Expert Cooking Pot"
  | "Advanced Cooking Pot";

type HelpLimitMonument = Omit<Decoration, "name"> & {
  name: HelpLimitMonumentName;
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
  | HelpLimitMonument
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
  Cornucopia: {
    name: "Cornucopia",
    description: "",
    coins: 0,
    ingredients: {},
  },
};

export const HELP_LIMIT_MONUMENTS: Record<
  HelpLimitMonumentName,
  HelpLimitMonument
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

export const MONUMENTS = {
  ...HELP_LIMIT_MONUMENTS,
  ...MEGASTORE_MONUMENTS,
};

export const WORKBENCH_MONUMENTS: Record<
  WorkbenchMonumentName,
  LandscapingMonument
> = {
  ...HELP_LIMIT_MONUMENTS,
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
  | HelpLimitMonumentName
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
  Cornucopia: 1000,
};

export type VillageProjectName = Exclude<
  WorkbenchMonumentName,
  HelpLimitMonumentName
>;

export const REWARD_ITEMS: Record<
  VillageProjectName,
  {
    item: InventoryItemName;
    amount: number;
  }
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

export function isMonumentComplete({
  game,
  monument,
}: {
  game: GameState;
  monument: MonumentName;
}) {
  return (
    (game.socialFarming.villageProjects?.[monument]?.cheers ?? 0) >=
    REQUIRED_CHEERS[monument]
  );
}

export function isHelpComplete({ game }: { game: GameState }) {
  return getHelpRequired({ game }).totalCount <= 0;
}

// Returns a count of help tasks needed on the farm
export function getHelpRequired({ game }: { game: GameState }) {
  const villageProjects = game.socialFarming.villageProjects;
  const collectibles = game.collectibles;
  const homeCollectibles = game.home.collectibles;
  const clutterLocations = game.socialFarming.clutter?.locations;
  const pets = game.pets;

  // Reduce clutter to get a count of each type
  const clutter = getKeys(clutterLocations ?? {}).reduce(
    (acc, id) => {
      const type = clutterLocations?.[id]?.type as ClutterName;
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    },
    {} as Record<ClutterName, number>,
  );

  const { pendingLandProjects, pendingHomeProjects } = getKeys(
    villageProjects,
  ).reduce<{
    pendingLandProjects: MonumentName[];
    pendingHomeProjects: MonumentName[];
  }>(
    (acc, monument) => {
      const canBeHelped =
        !villageProjects[monument]?.helpedAt &&
        (villageProjects[monument]?.cheers ?? 0) < REQUIRED_CHEERS[monument];

      if (!canBeHelped) return acc;

      const isProjectPlacedOnLand = !!collectibles[monument]?.some(
        (item) => !!item.coordinates,
      );
      const isProjectPlacedInHome = !!homeCollectibles[monument]?.some(
        (item) => !!item.coordinates,
      );

      if (isProjectPlacedOnLand) {
        acc.pendingLandProjects = [...acc.pendingLandProjects, monument];

        return acc;
      }

      if (isProjectPlacedInHome) {
        acc.pendingHomeProjects = [...acc.pendingHomeProjects, monument];

        return acc;
      }

      return acc;
    },
    { pendingLandProjects: [], pendingHomeProjects: [] },
  );

  const { pendingLandCommonPets, pendingHomeCommonPets } = getKeys(
    pets?.common ?? {},
  ).reduce<{
    pendingLandCommonPets: PetName[];
    pendingHomeCommonPets: PetName[];
  }>(
    (acc, name) => {
      const pet = pets?.common?.[name];

      if (!pet) return acc;

      if (pet.visitedAt) return acc;

      const isPetPlacedOnLand = !!collectibles[name]?.some(
        (item) => !!item.coordinates,
      );
      const isPetPlacedOnHome = !!homeCollectibles[name]?.some(
        (item) => !!item.coordinates,
      );

      if (isPetPlacedOnLand) {
        acc.pendingLandCommonPets = [...acc.pendingLandCommonPets, name];

        return acc;
      }

      if (isPetPlacedOnHome) {
        acc.pendingHomeCommonPets = [...acc.pendingHomeCommonPets, name];

        return acc;
      }

      return acc;
    },
    {
      pendingLandCommonPets: [],
      pendingHomeCommonPets: [],
    },
  );

  const { pendingLandNftPets, pendingHomeNftPets } = getKeys(
    pets?.nfts ?? {},
  ).reduce<{
    pendingLandNftPets: PetNFTName[];
    pendingHomeNftPets: PetNFTName[];
  }>(
    (acc, id) => {
      const pet = pets?.nfts?.[id];
      if (!pet) return acc;

      if (pet.visitedAt) return acc;

      if (pet.location === "farm") {
        acc.pendingLandNftPets = [...acc.pendingLandNftPets, pet.name];

        return acc;
      }

      if (pet.location === "home") {
        acc.pendingHomeNftPets = [...acc.pendingHomeNftPets, pet.name];

        return acc;
      }

      return acc;
    },
    { pendingLandNftPets: [], pendingHomeNftPets: [] },
  );

  const totalPendingPets =
    pendingLandCommonPets.length +
    pendingHomeCommonPets.length +
    pendingLandNftPets.length +
    pendingHomeNftPets.length;

  const totalClutter = Object.values(clutter).reduce(
    (acc, count: number) => acc + count,
    0,
  );

  return {
    totalCount:
      totalClutter +
      pendingLandProjects.length +
      pendingHomeProjects.length +
      totalPendingPets,
    tasks: {
      farm: {
        count:
          totalClutter +
          pendingLandProjects.length +
          pendingLandCommonPets.length +
          pendingLandNftPets.length,
        projects: pendingLandProjects,
        clutter: clutter,
        pets: [...pendingLandCommonPets, ...pendingLandNftPets],
      },
      home: {
        count:
          pendingHomeProjects.length +
          pendingHomeCommonPets.length +
          pendingHomeNftPets.length,
        projects: pendingHomeProjects,
        pets: [...pendingHomeCommonPets, ...pendingHomeNftPets],
      },
    },
  };
}

export const HELP_LIMIT = 5;

export function getHelpLimit({
  game,
  now = new Date(),
}: {
  game: GameState;
  now?: Date;
}) {
  let limit = HELP_LIMIT;

  const monuments = {
    ...HELP_LIMIT_MONUMENTS,
  };

  getKeys(monuments).forEach((monument) => {
    if (
      isMonumentComplete({ game, monument }) &&
      isCollectibleBuilt({ name: monument, game })
    ) {
      limit += 1;
    }
  });

  if (
    isCollectibleBuilt({ name: "Teamwork Monument", game }) &&
    isMonumentComplete({ game, monument: "Teamwork Monument" })
  ) {
    limit += 1;
  }

  // Get all the increases for the current UTC date
  const increases =
    game.socialFarming?.helpIncrease?.boughtAt.filter(
      (date) =>
        new Date(date).toISOString().split("T")[0] ===
        now.toISOString().split("T")[0],
    )?.length ?? 0;

  return limit + increases;
}

export function hasHitHelpLimit({
  game,
  totalHelpedToday,
}: {
  game: GameState;
  totalHelpedToday: number;
}) {
  return totalHelpedToday >= getHelpLimit({ game });
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
