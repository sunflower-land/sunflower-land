import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import { SeasonName } from "./seasons";

type SeasonalStoreBase = {
  cost: {
    items: Partial<Record<InventoryItemName, number>>;
    sfl: number;
  };
};

export type SeasonalStoreWearable = SeasonalStoreBase & {
  wearable: BumpkinItem;
};
export type SeasonalStoreCollectible = SeasonalStoreBase & {
  collectible: InventoryItemName;
};

export type SeasonalStoreItem =
  | SeasonalStoreWearable
  | SeasonalStoreCollectible;

export type SeasonalStore = {
  basic: {
    items: SeasonalStoreItem[];
  };
  rare: {
    items: SeasonalStoreItem[];
    requirement: number;
  };
  epic: {
    items: SeasonalStoreItem[];
    requirement: number;
  };
};

const EMPTY_SEASONAL_STORE: SeasonalStore = {
  basic: {
    items: [],
  },
  rare: {
    items: [],
    requirement: 0,
  },
  epic: {
    items: [],
    requirement: 0,
  },
};

// Test only
const PHARAOH_ITEMS: SeasonalStoreItem[] = [
  {
    wearable: "Red Farmer Shirt",
    cost: {
      items: {
        Wood: 1,
      },
      sfl: 0,
    },
  },
  {
    wearable: "Blue Farmer Shirt",
    cost: {
      items: {
        Wood: 1,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Basic Bear",
    cost: {
      items: {
        Wood: 1,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Treasure Key",
    cost: {
      items: {
        Wood: 1,
      },
      sfl: 0,
    },
  },
];

export const MEGASTORE: Record<SeasonName, SeasonalStore> = {
  "Catch the Kraken": EMPTY_SEASONAL_STORE,
  "Clash of Factions": EMPTY_SEASONAL_STORE,
  "Dawn Breaker": EMPTY_SEASONAL_STORE,
  "Solar Flare": EMPTY_SEASONAL_STORE,
  "Spring Blossom": EMPTY_SEASONAL_STORE,
  "Witches' Eve": EMPTY_SEASONAL_STORE,
  "Pharaoh's Treasure": {
    basic: {
      items: PHARAOH_ITEMS,
    },
    rare: {
      items: PHARAOH_ITEMS,
      requirement: 3,
    },
    epic: {
      items: PHARAOH_ITEMS,
      requirement: 7,
    },
  },
};
