import Decimal from "decimal.js-light";
import { SeedName, SEEDS } from "../types/crops";
import { InventoryItemName } from "../types/game";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Flag, FLAGS } from "./flags";
import { marketRate } from "../lib/halvening";
import { KNOWN_IDS, KNOWN_ITEMS, LimitedItemType } from ".";
import { OnChainLimitedItems } from "../lib/goblinMachine";
import { isArray } from "lodash";
import { CONFIG } from "lib/config";

export { FLAGS };

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
  amount: number;
};

export type CraftableName =
  | LimitedItemName
  | Tool
  | SeedName
  | Food
  | Animal
  | Flag;

export interface Craftable {
  name: CraftableName;
  description: string;
  price?: Decimal;
  ingredients: Ingredient[];
  limit?: number;
  supply?: number;
  disabled?: boolean;
  requires?: InventoryItemName;
  section?: Section;
}

// NEW ===========

export type Ingredient = {
  id?: number;
  item: InventoryItemName;
  amount: Decimal;
};

export interface CraftableItem {
  id?: number;
  name: CraftableName;
  description: string;
  tokenAmount?: Decimal;
  ingredients?: Ingredient[];
  disabled?: boolean;
  requires?: InventoryItemName;
  /**
   * When enabled, description and price will display as "?"
   * This is to reduce people viewing placeholder development code and assuming that is the price/buff
   */
  isPlaceholder?: boolean;
}

export interface LimitedItem extends CraftableItem {
  maxSupply?: number;
  section?: Section;
  cooldownSeconds?: number;
  mintedAt?: number;
  type?: LimitedItemType;
}

export type MOMEventItem = "Engine Core" | "Observatory";

export type BlacksmithItem =
  | "Sunflower Statue"
  | "Potato Statue"
  | "Christmas Tree"
  | "Gnome"
  | "Sunflower Tombstone"
  | "Sunflower Rock"
  | "Goblin Crown"
  | "Fountain"
  | "Woody the Beaver"
  | "Apprentice Beaver"
  | "Foreman Beaver"
  | "Nyon Statue"
  | "Homeless Tent"
  | "Egg Basket"
  | "Farmer Bath"
  | "Mysterious Head"
  | "Tunnel Mole"
  | "Rocky the Mole"
  | "Nugget"
  | "Rock Golem";

export type BarnItem =
  | "Farm Cat"
  | "Farm Dog"
  | "Chicken Coop"
  | "Gold Egg"
  | "Easter Bunny";

export type MarketItem =
  | "Nancy"
  | "Scarecrow"
  | "Kuebiko"
  | "Golden Cauliflower"
  | "Mysterious Parsnip"
  | "Carrot Sword"
  | "Golden Bonsai";

export type LimitedItemName =
  | BlacksmithItem
  | BarnItem
  | MarketItem
  | Flag
  | MOMEventItem;

export type Tool =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Hammer"
  | "Rod";

export type Food =
  | "Pumpkin Soup"
  | "Roasted Cauliflower"
  | "Sauerkraut"
  | "Radish Pie";

export type Animal = "Chicken" | "Cow" | "Pig" | "Sheep";

export const FOODS: () => Record<Food, CraftableItem> = () => ({
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description: "A creamy soup that goblins love",
    tokenAmount: marketRate(3),
    ingredients: [
      {
        item: "Pumpkin",
        amount: new Decimal(5),
      },
    ],
    limit: 1,
  },
  Sauerkraut: {
    name: "Sauerkraut",
    description: "Fermented cabbage",
    tokenAmount: marketRate(25),
    ingredients: [
      {
        item: "Cabbage",
        amount: new Decimal(10),
      },
    ],
  },
  "Roasted Cauliflower": {
    name: "Roasted Cauliflower",
    description: "A Goblin's favourite",
    tokenAmount: marketRate(150),
    ingredients: [
      {
        item: "Cauliflower",
        amount: new Decimal(30),
      },
    ],
  },
  "Radish Pie": {
    name: "Radish Pie",
    description: "Despised by humans, loved by goblins",
    tokenAmount: marketRate(300),
    ingredients: [
      {
        item: "Radish",
        amount: new Decimal(60),
      },
    ],
  },
});

export const TOOLS: Record<Tool, CraftableItem> = {
  Axe: {
    name: "Axe",
    description: "Used to collect wood",
    tokenAmount: new Decimal(1),
    ingredients: [],
  },
  Pickaxe: {
    name: "Pickaxe",
    description: "Used to collect stone",
    tokenAmount: new Decimal(1),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(2),
      },
    ],
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description: "Used to collect iron",
    tokenAmount: new Decimal(2),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(3),
      },
      {
        item: "Stone",
        amount: new Decimal(3),
      },
    ],
  },
  "Iron Pickaxe": {
    name: "Iron Pickaxe",
    description: "Used to collect gold",
    tokenAmount: new Decimal(5),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Iron",
        amount: new Decimal(3),
      },
    ],
  },
  Hammer: {
    name: "Hammer",
    description: "Used to construct buildings",
    tokenAmount: new Decimal(5),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Stone",
        amount: new Decimal(5),
      },
    ],
    disabled: true,
  },
  Rod: {
    name: "Rod",
    description: "Used to fish trout",
    tokenAmount: new Decimal(5),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
    ],
    disabled: true,
  },
};

export const ROCKET_ITEMS: Record<MOMEventItem, LimitedItem> = {
  "Engine Core": {
    name: "Engine Core",
    description: "The power of the sunflower",
    type: LimitedItemType.MOMEventItem,
  },
  Observatory: {
    name: "Observatory",
    description: "Explore the stars and improve scientific development",
    section: Section.Observatory,
    type: LimitedItemType.MOMEventItem,
  },
};

export const BLACKSMITH_ITEMS: Record<BlacksmithItem, LimitedItem> = {
  "Sunflower Statue": {
    name: "Sunflower Statue",
    description: "A symbol of the holy token",
    section: Section["Sunflower Statue"],
    type: LimitedItemType.BlacksmithItem,
  },
  "Potato Statue": {
    name: "Potato Statue",
    description: "The OG potato hustler flex",
    section: Section["Potato Statue"],
    type: LimitedItemType.BlacksmithItem,
  },
  "Christmas Tree": {
    name: "Christmas Tree",
    description: "Receive a Santa Airdrop on Christmas day",
    section: Section["Christmas Tree"],
    type: LimitedItemType.BlacksmithItem,
  },
  Gnome: {
    name: "Gnome",
    description: "A lucky gnome",
    section: Section.Gnome,
    type: LimitedItemType.BlacksmithItem,
  },
  "Homeless Tent": {
    name: "Homeless Tent",
    description: "A nice and cozy tent",
    section: Section.Tent,
    type: LimitedItemType.BlacksmithItem,
  },
  "Sunflower Tombstone": {
    name: "Sunflower Tombstone",
    description: "In memory of Sunflower Farmers",
    section: Section["Sunflower Tombstone"],
    type: LimitedItemType.BlacksmithItem,
  },
  "Sunflower Rock": {
    name: "Sunflower Rock",
    description: "The game that broke Polygon",
    section: Section["Sunflower Rock"],
    type: LimitedItemType.BlacksmithItem,
  },
  "Goblin Crown": {
    name: "Goblin Crown",
    description: "Summon the leader of the Goblins",
    section: Section["Goblin Crown"],
    type: LimitedItemType.BlacksmithItem,
  },
  Fountain: {
    name: "Fountain",
    description: "A relaxing fountain for your farm",
    section: Section.Fountain,
    type: LimitedItemType.BlacksmithItem,
  },
  "Nyon Statue": {
    name: "Nyon Statue",
    description: "In memory of Nyon Lann",
    // TODO: Add section
    type: LimitedItemType.BlacksmithItem,
  },
  "Farmer Bath": {
    name: "Farmer Bath",
    description: "A beetroot scented bath for the farmers",
    section: Section["Bath"],
    type: LimitedItemType.BlacksmithItem,
  },
  "Woody the Beaver": {
    name: "Woody the Beaver",
    description: "Increase wood drops by 20%",
    section: Section.Beaver,
    type: LimitedItemType.BlacksmithItem,
  },
  "Apprentice Beaver": {
    name: "Apprentice Beaver",
    description: "Trees recover 50% faster",
    section: Section.Beaver,
    type: LimitedItemType.BlacksmithItem,
  },
  "Foreman Beaver": {
    name: "Foreman Beaver",
    description: "Cut trees without axes",
    section: Section.Beaver,
    type: LimitedItemType.BlacksmithItem,
  },
  "Egg Basket": {
    name: "Egg Basket",
    description: "Gives access to the Easter Egg Hunt",
    type: LimitedItemType.BlacksmithItem,
  },
  "Mysterious Head": {
    name: "Mysterious Head",
    description: "A statue thought to protect farmers",
    section: Section["Mysterious Head"],
    type: LimitedItemType.BlacksmithItem,
  },
  "Tunnel Mole": {
    name: "Tunnel Mole",
    description: "Gives a 25% increase to stone mines",
    section: Section.Mole,
    type: LimitedItemType.BlacksmithItem,
  },
  "Rocky the Mole": {
    name: "Rocky the Mole",
    description: "Gives a 999% increase to iron mines",
    section: Section.Mole,
    type: LimitedItemType.BlacksmithItem,
    isPlaceholder: true,
  },
  Nugget: {
    name: "Nugget",
    description: "Gives a 999% increase to gold mines",
    section: Section.Mole,
    type: LimitedItemType.BlacksmithItem,
    isPlaceholder: true,
  },
  "Rock Golem": {
    name: "Rock Golem",
    description: "Gives a 10% chance to get 5x stone",
    section: Section["Rock Golem"],
    type: LimitedItemType.BlacksmithItem,
    isPlaceholder: true,
  },
};

export const MARKET_ITEMS: Record<MarketItem, LimitedItem> = {
  Nancy: {
    name: "Nancy",
    description: "Keeps a few crows away. Crops grow 15% faster",
    section: Section.Scarecrow,
    type: LimitedItemType.MarketItem,
  },
  Scarecrow: {
    name: "Scarecrow",
    description: "A goblin scarecrow. Yield 20% more crops",
    section: Section.Scarecrow,
    type: LimitedItemType.MarketItem,
  },
  Kuebiko: {
    name: "Kuebiko",
    description:
      "Even the shopkeeper is scared of this scarecrow. Seeds are free",
    section: Section.Scarecrow,
    type: LimitedItemType.MarketItem,
  },
  "Golden Cauliflower": {
    name: "Golden Cauliflower",
    description: "Double the rewards from cauliflowers",
    type: LimitedItemType.MarketItem,
  },
  "Mysterious Parsnip": {
    name: "Mysterious Parsnip",
    description: "Parsnips grow 50% faster",
    type: LimitedItemType.MarketItem,
  },
  "Carrot Sword": {
    name: "Carrot Sword",
    description: "Increase chance of a mutant crop appearing",
    type: LimitedItemType.MarketItem,
  },
  "Golden Bonsai": {
    name: "Golden Bonsai",
    description: "Goblins love bonsai too",
    section: Section["Golden Bonsai"],
    type: LimitedItemType.MarketItem,
    isPlaceholder: true,
  },
};

export const BARN_ITEMS: Record<BarnItem, LimitedItem> = {
  "Chicken Coop": {
    name: "Chicken Coop",
    description: "Collect 3x the amount of eggs",
    section: Section["Chicken Coop"],
    type: LimitedItemType.BarnItem,
  },
  "Farm Cat": {
    name: "Farm Cat",
    description: "Keep the rats away",
    section: Section["Farm Cat"],
    type: LimitedItemType.BarnItem,
  },
  "Farm Dog": {
    name: "Farm Dog",
    description: "Herd sheep 4x faster",
    section: Section["Farm Dog"],
    type: LimitedItemType.BarnItem,
  },
  "Gold Egg": {
    name: "Gold Egg",
    description: "A rare egg, what lays inside?",
    type: LimitedItemType.BarnItem,
  },
  "Easter Bunny": {
    name: "Easter Bunny",
    description: "Earn 20% more Carrots",
    section: Section["Easter Bunny"],
    type: LimitedItemType.BarnItem,
  },
};

export const ANIMALS: () => Record<Animal, CraftableItem> = () => ({
  Chicken: {
    name: "Chicken",
    description: "Produces eggs. Requires wheat for feeding",
    tokenAmount: marketRate(200),
    ingredients: [],
    disabled: CONFIG.NETWORK === "mainnet",
  },
  Cow: {
    name: "Cow",
    description: "Produces milk. Requires wheat for feeding",
    tokenAmount: new Decimal(50),
    ingredients: [],
    disabled: true,
  },
  Pig: {
    name: "Pig",
    description: "Produces manure. Requires wheat for feeding",
    tokenAmount: new Decimal(20),
    ingredients: [],
    disabled: true,
  },
  Sheep: {
    name: "Sheep",
    description: "Produces wool. Requires wheat for feeding",
    tokenAmount: new Decimal(20),
    ingredients: [],
    disabled: true,
  },
});

type Craftables = Record<CraftableName, CraftableItem>;

export const CRAFTABLES: () => Craftables = () => ({
  ...TOOLS,
  ...BLACKSMITH_ITEMS,
  ...BARN_ITEMS,
  ...MARKET_ITEMS,
  ...SEEDS(),
  ...FOODS(),
  ...ANIMALS(),
  ...FLAGS,
  ...ROCKET_ITEMS,
});

/**
 * getKeys is a ref to Object.keys, but the return is typed literally.
 */
export const getKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;

export const LIMITED_ITEMS = {
  ...BLACKSMITH_ITEMS,
  ...BARN_ITEMS,
  ...MARKET_ITEMS,
  ...FLAGS,
  ...ROCKET_ITEMS,
};

export const LIMITED_ITEM_NAMES = getKeys(LIMITED_ITEMS);

export const makeLimitedItemsByName = (
  items: Record<LimitedItemName, LimitedItem>,
  onChainItems: OnChainLimitedItems
) => {
  return getKeys(items).reduce((limitedItems, itemName) => {
    const name = itemName as LimitedItemName;
    // Get id form limited item name
    const id = KNOWN_IDS[name];
    // Get onchain item based on id
    const onChainItem = onChainItems[id];

    if (onChainItem) {
      const {
        tokenAmount,
        ingredientAmounts,
        ingredientIds,
        cooldownSeconds,
        maxSupply,
        mintedAt,
        enabled,
      } = onChainItem;

      // Build ingredients
      const ingredients = ingredientIds.map((id, index) => ({
        id,
        item: KNOWN_ITEMS[id],
        amount: new Decimal(ingredientAmounts[index]),
      }));

      limitedItems[name] = {
        id: onChainItem.mintId,
        name,
        description: items[name].description,
        tokenAmount: new Decimal(tokenAmount),
        maxSupply,
        cooldownSeconds,
        ingredients,
        mintedAt,
        type: items[name].type,
        disabled: !enabled,
        isPlaceholder: items[name].isPlaceholder,
      };
    }

    return limitedItems;
    // TODO: FIX TYPE
  }, {} as Record<CraftableName, LimitedItem>);
};

export const filterLimitedItemsByType = (
  type: LimitedItemType | LimitedItemType[],
  limitedItems: Record<LimitedItemName, LimitedItem>
) => {
  // Convert `obj` to a key/value array
  // `[['name', 'Luke Skywalker'], ['title', 'Jedi Knight'], ...]`
  const asArray = Object.entries(limitedItems);

  const filtered = asArray.filter(([_, value]) => {
    if (value.type && isArray(type)) {
      return type.includes(value.type);
    }

    return value.type === type;
  });

  // Convert the key/value array back to an object:
  // `{ name: 'Luke Skywalker', title: 'Jedi Knight' }`
  return Object.fromEntries(filtered);
};

export const isLimitedItem = (itemName: any) => {
  return !!getKeys(LIMITED_ITEMS).find(
    (limitedItemName) => limitedItemName === itemName
  );
};
