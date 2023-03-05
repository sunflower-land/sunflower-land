export type BumpkinBackground =
  | "Farm Background"
  | "Seashore Background"
  | "Forest Background"
  | "Cemetery Background"
  | "Space Background"
  | "Jail Background"
  | "Christmas Background"
  | "Mountain View Background"
  | "China Town Background"
  | "SFL Office Background";

export type BumpkinBody =
  | "Beige Farmer Potion"
  | "Light Brown Farmer Potion"
  | "Dark Brown Farmer Potion"
  | "Goblin Potion"
  | "Pirate Potion";

export type BumpkinHair =
  | "Basic Hair"
  | "Rancher Hair"
  | "Explorer Hair"
  | "Buzz Cut"
  | "Parlour Hair"
  | "Blondie"
  | "Sun Spots"
  | "Brown Long Hair"
  | "White Long Hair"
  | "Teal Mohawk"
  | "Red Long Hair"
  | "Blacksmith Hair"
  | "Fire Hair"
  | "Luscious Hair"
  | "Cupid Hair";

export type BumpkinShirt =
  | "Red Farmer Shirt"
  | "Yellow Farmer Shirt"
  | "Blue Farmer Shirt"
  | "Warrior Shirt"
  | "Fancy Top"
  | "Maiden Top"
  | "SFL T-Shirt"
  | "Project Dignity Hoodie"
  | "Developer Hoodie"
  | "Bumpkin Art Competition Merch"
  | "Fire Shirt"
  | "Pineapple Shirt"
  | "Fruit Picker Shirt"
  | "Striped Blue Shirt"
  | "Pirate Leather Polo"
  | "Hawaiian Shirt";

export type BumpkinCoat =
  | "Chef Apron"
  | "Fruit Picker Apron"
  | "Pirate General Coat";

export type BumpkinTool =
  | "Farmer Pitchfork"
  | "Sword"
  | "Axe"
  | "Parsnip"
  | "Golden Spatula"
  | "Hammer"
  | "Ancient War Hammer"
  | "Ancient Goblin Sword"
  | "Pirate Scimitar"
  | "Bumpkin Puppet"
  | "Goblin Puppet";

export type BumpkinShoe =
  | "Black Farmer Boots"
  | "Brown Boots"
  | "Yellow Boots"
  | "Bumpkin Boots"
  | "Peg Leg"
  | "Cupid Sandals";

export type BumpkinNecklace =
  | "Sunflower Amulet"
  | "Carrot Amulet"
  | "Beetroot Amulet"
  | "Green Amulet"
  | "Artist Scarf";

export type BumpkinHat =
  | "Farmer Hat"
  | "Chef Hat"
  | "Warrior Helmet"
  | "Skull Hat"
  | "Reindeer Antlers"
  | "Santa Hat"
  | "Lion Dance Mask"
  | "Fruit Bowl"
  | "Pirate Hat";

export type BumpkinPant =
  | "Farmer Overalls"
  | "Lumberjack Overalls"
  | "Farmer Pants"
  | "Warrior Pants"
  | "Brown Suspenders"
  | "Blue Suspenders"
  | "Fancy Pants"
  | "Maiden Skirt"
  | "Peasant Skirt"
  | "Pirate Pants";

export type BumpkinDress = "Cupid Dress";
export type BumpkinSecondaryTool = "Sunflower Shield" | "Crab Claw";

// Goes over clothes + head
export type BumpkinOnesie =
  | "Snowman Onesie"
  | "Shark Onesie"
  | "Bear Onesie"
  | "Tiger Onesie"
  | "Frog Onesie";

// Goes over clothes
export type BumpkinSuit = "Reindeer Suit";

export type BumpkinWings = "Angel Wings" | "Devil Wings" | "Love Quiver";
export type BumpkinItem =
  | BumpkinBody
  | BumpkinHair
  | BumpkinShirt
  | BumpkinPant
  | BumpkinDress
  | BumpkinTool
  | BumpkinShoe
  | BumpkinHat
  | BumpkinNecklace
  | BumpkinSecondaryTool
  | BumpkinBackground
  | BumpkinCoat
  | BumpkinOnesie
  | BumpkinSuit
  | BumpkinWings;

export const ITEM_IDS: Record<BumpkinItem, number> = {
  "Beige Farmer Potion": 1,
  "Dark Brown Farmer Potion": 2,
  "Light Brown Farmer Potion": 3,
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
  "Cemetery Background": 53,
  "Teal Mohawk": 54,
  "Space Background": 55,
  Parsnip: 56,
  "Jail Background": 57,
  "Golden Spatula": 58,
  "Artist Scarf": 59,
  "Bumpkin Art Competition Merch": 60,
  "Project Dignity Hoodie": 61,
  "Developer Hoodie": 62,
  "Blacksmith Hair": 63,
  Hammer: 64,
  "Bumpkin Boots": 65,
  "Fire Shirt": 66,
  "Red Long Hair": 67,
  "Snowman Onesie": 68,
  "Reindeer Suit": 69,
  "Shark Onesie": 70,
  "Christmas Background": 71,
  "Devil Wings": 72,
  "Angel Wings": 73,
  "Fire Hair": 74,
  "Luscious Hair": 75,
  "Ancient War Hammer": 76,
  "Ancient Goblin Sword": 77,
  "Mountain View Background": 78,
  "Skull Hat": 79,
  "Reindeer Antlers": 80,
  "Santa Hat": 81,
  "Pineapple Shirt": 82,
  "China Town Background": 83,
  "Lion Dance Mask": 84,
  "Fruit Picker Shirt": 85,
  "Fruit Picker Apron": 86,
  "Fruit Bowl": 87,
  "Striped Blue Shirt": 88,
  "Peg Leg": 89,
  "Pirate Potion": 90,
  "Pirate Hat": 91,
  "Pirate General Coat": 92,
  "Pirate Pants": 93,
  "Pirate Leather Polo": 94,
  "Crab Claw": 95,
  "Pirate Scimitar": 96,
  "Cupid Hair": 97,
  "Cupid Dress": 98,
  "Cupid Sandals": 99,
  "Love Quiver": 100,
  "SFL Office Background": 101,
  "Bumpkin Puppet": 102,
  "Goblin Puppet": 103,
  "Hawaiian Shirt": 104,
  "Bear Onesie": 105,
  "Frog Onesie": 106,
  "Tiger Onesie": 107,
};

// The reverse of above
export const ITEM_NAMES: Record<string, BumpkinItem> = Object.assign(
  {},
  ...Object.entries(ITEM_IDS).map(([a, b]) => ({ [b]: a }))
);

export const IDS = Object.values(ITEM_IDS);
export const NAMES = Object.keys(ITEM_IDS) as BumpkinItem[];

export type Wallet = {
  background: BumpkinBackground[];
  hair: BumpkinHair[];
  body: BumpkinBody[];
  shirt: BumpkinShirt[];
  pants: BumpkinPant[];
  shoes: BumpkinShoe[];
  tool: BumpkinTool[];
  necklace: BumpkinNecklace[];
  coat: BumpkinCoat[];
  hat: BumpkinHat[];
  secondaryTool: BumpkinSecondaryTool[];
  onesie: BumpkinOnesie[];
  suit: BumpkinSuit[];
  wings: BumpkinWings[];
  dress?: BumpkinDress[];
};

export type Equipped = {
  background: BumpkinBackground;
  hair: BumpkinHair;
  body: BumpkinBody;
  shirt?: BumpkinShirt;
  pants?: BumpkinPant;
  shoes: BumpkinShoe;
  tool: BumpkinTool;
  necklace?: BumpkinNecklace;
  coat?: BumpkinCoat;
  hat?: BumpkinHat;
  secondaryTool?: BumpkinSecondaryTool;
  onesie?: BumpkinOnesie;
  suit?: BumpkinSuit;
  wings?: BumpkinWings;
  dress?: BumpkinDress;
};

export type BumpkinPart = keyof Equipped;

export type WalletItems = Record<BumpkinItem, number>;

export const UNLIMITED_SUPPLY = 1000000;
