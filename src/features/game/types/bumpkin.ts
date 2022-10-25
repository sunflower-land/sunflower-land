export type BumpkinBackground =
  | "Farm Background"
  | "Seashore Background"
  | "Forest Background";

export type BumpkinBody =
  | "Beige Farmer Potion"
  | "Light Brown Farmer Potion"
  | "Dark Brown Farmer Potion"
  | "Goblin Potion";

export type BumpkinHair =
  | "Basic Hair"
  | "Rancher Hair"
  | "Explorer Hair"
  | "Buzz Cut"
  | "Parlour Hair"
  | "Blondie"
  | "Sun Spots"
  | "Brown Long Hair"
  | "White Long Hair";

export type BumpkinShirt =
  | "Red Farmer Shirt"
  | "Yellow Farmer Shirt"
  | "Blue Farmer Shirt"
  | "Chef Apron"
  | "Warrior Shirt"
  | "Fancy Top"
  | "Maiden Top"
  | "SFL T-Shirt";

export type BumpkinTool = "Farmer Pitchfork" | "Sword" | "Axe";

export type BumpkinShoes =
  | "Black Farmer Boots"
  | "Brown Boots"
  | "Yellow Boots";

export type BumpkinNecklace =
  | "Sunflower Amulet"
  | "Carrot Amulet"
  | "Beetroot Amulet"
  | "Green Amulet";

export type BumpkinHat = "Farmer Hat" | "Chef Hat" | "Warrior Helmet";

export type BumpkinPants =
  | "Farmer Overalls"
  | "Lumberjack Overalls"
  | "Farmer Pants"
  | "Warrior Pants"
  | "Brown Suspenders"
  | "Blue Suspenders"
  | "Fancy Pants"
  | "Maiden Skirt"
  | "Peasant Skirt";

export type BumpkinSecondaryTool = "Sunflower Shield";

export type BumpkinItem =
  | BumpkinBody
  | BumpkinHair
  | BumpkinShirt
  | BumpkinPants
  | BumpkinTool
  | BumpkinShoes
  | BumpkinHat
  | BumpkinNecklace
  | BumpkinSecondaryTool
  | BumpkinBackground;

export const ITEM_IDS: Record<BumpkinItem, number> = {
  "Beige Farmer Potion": 1,
  "Light Brown Farmer Potion": 2,
  "Dark Brown Farmer Potion": 3,
  "Goblin Potion": 4,
  "Basic Hair": 5,
  "Rancher Hair": 6,
  "Explorer Hair": 7,
  "Red Farmer Shirt": 13,
  "Yellow Farmer Shirt": 14,
  "Blue Farmer Shirt": 15,
  "Chef Apron": 16,
  "Warrior Shirt": 17,
  "Farmer Overalls": 18,
  "Lumberjack Overalls": 19,
  "Farmer Pants": 20,
  "Warrior Pants": 21,
  "Black Farmer Boots": 22,
  "Farmer Pitchfork": 23,
  "Farmer Hat": 24,
  "Chef Hat": 25,
  "Warrior Helmet": 26,
  "Sunflower Amulet": 27,
  "Carrot Amulet": 28,
  "Beetroot Amulet": 29,
  "Green Amulet": 30,
  "Sunflower Shield": 31,
  "Farm Background": 32,
  "Fancy Top": 33,
  "Brown Boots": 34,
  "Brown Suspenders": 35,
  "Fancy Pants": 36,
  "Maiden Skirt": 37,
  "Maiden Top": 38,
  "Peasant Skirt": 39,
  "SFL T-Shirt": 40,
  "Yellow Boots": 41,
  "Buzz Cut": 42,
  "Parlour Hair": 43,
  Axe: 44,
  Sword: 45,
  "Blue Suspenders": 46,
  "Forest Background": 47,
  "Seashore Background": 48,
  Blondie: 49,
  "Brown Long Hair": 50,
  "Sun Spots": 51,
  "White Long Hair": 52,
};

// The reverse of above
export const ITEM_NAMES: Record<string, BumpkinItem> = Object.assign(
  {},
  ...Object.entries(ITEM_IDS).map(([a, b]) => ({ [b]: a }))
);

export const IDS = Object.values(ITEM_IDS);
export const NAMES = Object.keys(ITEM_IDS) as BumpkinItem[];

export type BumpkinParts = {
  background: BumpkinBackground;
  hair: BumpkinHair;
  body: BumpkinBody;
  shirt: BumpkinShirt;
  pants: BumpkinPants;
  shoes: BumpkinShoes;
  tool?: BumpkinTool;
  secondaryTool?: BumpkinSecondaryTool;
  necklace?: BumpkinNecklace;
  hat?: BumpkinHat;
};

export type BumpkinPart = keyof BumpkinParts;

export type WalletItems = Record<BumpkinItem, number>;
