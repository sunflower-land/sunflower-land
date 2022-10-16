export type BumpkinBody =
  | "Beige Farmer Potion"
  | "Light Brown Farmer Potion"
  | "Dark Brown Farmer Potion"
  | "Goblin Potion";

export type BumpkinHair = "Basic Hair" | "Rancher Hair" | "Explorer Hair";

export type BumpkinShirt =
  | "Red Farmer Shirt"
  | "Yellow Farmer Shirt"
  | "Blue Farmer Shirt"
  | "Chef Apron"
  | "Warrior Shirt";

type BumpkinTools = "Farmer Pitchfork";

type BumpkinShoes = "Black Farmer Boots";

type BumpkinNecklace =
  | "Sunflower Amulet"
  | "Carrot Amulet"
  | "Beetroot Amulet"
  | "Green Amulet";

type BumpkinHat = "Farmer Hat" | "Chef Hat" | "Warrior Helmet";

export type BumpkinWallpaper = "Farm Background";

export type BumpkinPants =
  | "Farmer Overalls"
  | "Lumberjack Overalls"
  | "Farmer Pants"
  | "Warrior Pants";

export type BumpkinItems =
  | BumpkinBody
  | BumpkinHair
  | BumpkinShirt
  | BumpkinPants
  | BumpkinTools
  | BumpkinShoes
  | BumpkinHat
  | BumpkinNecklace
  | BumpkinWallpaper;

export type BumpkinParts = {
  background: BumpkinWallpaper;
  hair: BumpkinHair;
  body: BumpkinBody;
  shirt: BumpkinShirt;
  pants: BumpkinPants;
  shoes: BumpkinShoes;
  tool?: BumpkinTools;
  necklace?: BumpkinNecklace;
  hat?: BumpkinHat;
};

export type BumpkinPart = keyof BumpkinParts;

export type WalletItems = Record<BumpkinItems, number>;
