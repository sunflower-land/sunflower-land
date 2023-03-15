import { GoblinState } from "features/game/lib/goblinMachine";
import { CHICKEN_TIME_TO_EGG } from "features/game/lib/constants";
import { CROPS, CROP_SEEDS } from "./crops";
<<<<<<< HEAD
import { FRUIT, FruitName } from "./fruits";
=======
import { FRUIT } from "./fruits";
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> ed2fc011 (Move resources onto root level and tokenise)
=======
import { COUPONS, FERTILISERS } from "./game";
>>>>>>> 58978048 (Fix TSC)
import {
  FOODS,
  QUEST_ITEMS,
  SHOVELS,
  TOOLS,
  WAR_BANNERS,
  WAR_TENT_ITEMS,
} from "./craftables";
import { EASTER_EGGS, Inventory, InventoryItemName } from "./game";
import { FLAGS, getKeys, MUTANT_CHICKENS } from "./craftables";
import { COMMODITIES, RESOURCES } from "./resources";
import { canChop } from "../events/landExpansion/chop";
import { canMine } from "../events/landExpansion/stoneMine";
import { AchievementName } from "./achievements";
import { SEEDS } from "./seeds";
import { BEANS } from "./beans";
import { HELIOS_BLACKSMITH_ITEMS } from "./collectibles";
import { SKILL_TREE } from "./skills";
import { BUILDINGS } from "./buildings";
import { CONSUMABLES } from "./consumables";
import { HELIOS_DECORATIONS } from "./decorations";
import { TREASURE_TOOLS } from "./tools";

type WithdrawCondition = boolean | ((gameState: GoblinState) => boolean);

// Helps build withdraw rules for item groups
function buildDefaults<T extends InventoryItemName>(
  itemNames: T[],
  withdrawCondition: WithdrawCondition
): Record<T, WithdrawCondition> {
  return itemNames.reduce(
    (prev, cur) => ({
      ...prev,
      [cur]: withdrawCondition,
    }),
    {} as Record<T, WithdrawCondition>
  );
}

// Helper functions
type CanWithdrawArgs = {
  item: InventoryItemName;
  game: GoblinState;
};

function cropIsPlanted({ item, game }: CanWithdrawArgs): boolean {
  return Object.values(game.plots ?? {}).some(
    (plot) => plot.crop && plot.crop.name === item
  );
}

function hasSeeds(inventory: Inventory) {
  return getKeys(inventory).some((name) => name in CROP_SEEDS());
}

function areAnyCropsPlanted(game: GoblinState): boolean {
  return Object.values(game.plots ?? {}).some((plot) => !!plot.crop);
}

function areAnyTreesChopped(game: GoblinState): boolean {
  return Object.values(game.trees ?? {}).some((tree) => !canChop(tree));
}

function areAnyStonesMined(game: GoblinState): boolean {
  return Object.values(game.stones ?? {}).some((stone) => !canMine(stone));
}

function areAnyIronsMined(game: GoblinState): boolean {
  return Object.values(game.iron ?? {}).some((iron) => !canMine(iron));
}

function areAnyGoldsMined(game: GoblinState): boolean {
  return Object.values(game.gold ?? {}).some((gold) => !canMine(gold));
}

function areAnyChickensFed(game: GoblinState): boolean {
  return Object.values(game.chickens).some(
    (chicken) =>
      chicken.fedAt && Date.now() - chicken.fedAt < CHICKEN_TIME_TO_EGG
  );
}

function areAnyTreasureHolesDug(game: GoblinState): boolean {
  return Object.values(game.treasureIsland?.holes ?? {}).some((hole) => {
    const today = new Date().toISOString().substring(0, 10);

    return new Date(hole.dugAt).toISOString().substring(0, 10) == today;
  });
}

function areFruitsGrowing(game: GoblinState, fruit: FruitName): boolean {
  return Object.values(game.expansions).some((expansion) =>
    Object.values(expansion.fruitPatches ?? {}).some(
      (patch) => patch.fruit?.name === fruit
    )
  );
}

function hasCompletedAchievement(
  game: GoblinState,
  achievement: AchievementName
): boolean {
  return Object.keys(game.bumpkin?.achievements ?? []).includes(achievement);
}

// Group withdraw conditions for common items
const cropDefaults = buildDefaults(getKeys(CROPS()), true);
// Fruits will be disabled untill all the fruit SFT's are sold out
const seedDefaults = buildDefaults(getKeys(SEEDS()), false);
const beanDefaults = buildDefaults(getKeys(BEANS()), false);
const questItemDefaults = buildDefaults(getKeys(QUEST_ITEMS), false);
const warTentItemsDefaults = buildDefaults(getKeys(WAR_TENT_ITEMS), false);
const toolDefaults = buildDefaults(
  getKeys({ ...TOOLS, ...TREASURE_TOOLS }),
  false
);
const foodDefaults = buildDefaults(getKeys(FOODS()), false);
const shovelDefaults = buildDefaults(getKeys(SHOVELS), false);
const warBannerDefaults = buildDefaults(getKeys(WAR_BANNERS), false);
const heliosBlacksmithDefaults = buildDefaults(
  getKeys(HELIOS_BLACKSMITH_ITEMS),
  false
);
const resourceDefaults = buildDefaults(getKeys(RESOURCES), false);
const commodityDefaults = buildDefaults(getKeys(COMMODITIES), true);
const fruitDefaults = buildDefaults(getKeys(FRUIT()), false);
const mutantChickenDefaults = buildDefaults(
  getKeys(MUTANT_CHICKENS),
  (game) => !areAnyChickensFed(game)
);
const flagDefaults = buildDefaults(getKeys(FLAGS), true);
const easterEggDefaults = buildDefaults([...EASTER_EGGS, "Egg Basket"], true);
const skillDefaults = buildDefaults(getKeys(SKILL_TREE), false);
const couponDefaults = buildDefaults(getKeys(COUPONS), false);
const buildingDefaults = buildDefaults(getKeys(BUILDINGS()), false);
const fertiliserDefaults = buildDefaults(getKeys(FERTILISERS), false);
const consumableDefaults = buildDefaults(getKeys(CONSUMABLES), false);
const decorationDefaults = buildDefaults(getKeys(HELIOS_DECORATIONS()), false);

const mutantCropDefaults = {
  "Stellar Sunflower": false,
  "Peaceful Potato": false,
  "Perky Pumpkin": false,
  "Colossal Crop": false,
};
const specialEventsDefaults = {
  "Chef Apron": false,
  "Chef Hat": false,
};
const pointDefaults = {
  "Human War Point": false,
  "Goblin War Point": false,
};

export const WITHDRAWABLES: Record<InventoryItemName, WithdrawCondition> = {
  ...cropDefaults,
  ...seedDefaults,
  ...beanDefaults,
  ...questItemDefaults,
  ...warTentItemsDefaults,
  ...toolDefaults,
  ...foodDefaults,
  ...shovelDefaults,
  ...warBannerDefaults,
  ...heliosBlacksmithDefaults,
  ...fruitDefaults,
  ...commodityDefaults,
  ...resourceDefaults,
  ...mutantChickenDefaults,
  ...flagDefaults,
  ...easterEggDefaults,
  ...skillDefaults,
  ...couponDefaults,
  ...buildingDefaults,
  ...fertiliserDefaults,
  ...consumableDefaults,
  ...decorationDefaults,
  ...mutantCropDefaults,
  ...specialEventsDefaults,
  ...pointDefaults,

  // Explicit Rules
  Chicken: false,
  Cow: false,
  Pig: false,
  Sheep: false,
  "Basic Bear": false,
  "Farm Cat": true,
  "Farm Dog": true,
  "Sunflower Statue": true,
  "Potato Statue": true,
  "Christmas Tree": true,
  Gnome: true,
  "Homeless Tent": true,
  "Sunflower Tombstone": true,
  "Sunflower Rock": true,
  "Goblin Crown": true,
  Fountain: true,
  "Nyon Statue": true,
  "Farmer Bath": true,
  "Mysterious Head": true,
  "Golden Bonsai": true,
  "Wicker Man": true,
  "Engine Core": false,
  Observatory: true,
  "Christmas Snow Globe": true,
  "Chef Bear": true,
  "Construction Bear": true,
  "Angel Bear": true,
  "Badass Bear": true,
  "Bear Trap": true,
  "Brilliant Bear": true,
  "Classy Bear": true,
  "Farmer Bear": true,
  "Sunflower Bear": true,
  "Rich Bear": true,
  "Rainbow Artist Bear": true,
  "Devil Bear": true,
  "Christmas Bear": true,
  "War Skull": true,
  "War Tombstone": true,
  "Maneki Neko": true,
  "Lady Bug": false,
  "Cyborg Bear": true,
  "Heart Balloons": true,
  Flamingo: true,
  "Blossom Tree": true,
  "Valentine Bear": true,
  // TODO add rule when beans are introduced
  "Carrot Sword": true,

  // Conditional Rules
  "Chicken Coop": (game) => !areAnyChickensFed(game),
  Rooster: (game) => !areAnyChickensFed(game),
  "Undead Rooster": (game) => !areAnyChickensFed(game),
  "Gold Egg": (game) => !areAnyChickensFed(game),
  "Peeled Potato": (game) => !cropIsPlanted({ item: "Potato", game }),
  "Victoria Sisters": (game) => !cropIsPlanted({ item: "Pumpkin", game }),
  "Easter Bunny": (game) => !cropIsPlanted({ item: "Carrot", game }),
  "Golden Cauliflower": (game) => !cropIsPlanted({ item: "Cauliflower", game }),
  "Mysterious Parsnip": (game) => !cropIsPlanted({ item: "Parsnip", game }),
  "Lunar Calendar": (game) => !areAnyCropsPlanted(game),
  Nancy: (game) => !areAnyCropsPlanted(game),
  Scarecrow: (game) => !areAnyCropsPlanted(game),
  Kuebiko: (game) => !areAnyCropsPlanted(game) && !hasSeeds(game.inventory),
  "Woody the Beaver": (game) => !areAnyTreesChopped(game),
  "Apprentice Beaver": (game) => !areAnyTreesChopped(game),
  "Foreman Beaver": (game) => !areAnyTreesChopped(game),
  "Wood Nymph Wendy": (game) => !areAnyTreesChopped(game),
  "Tiki Totem": (game) => !areAnyTreesChopped(game),
  "Rock Golem": (game) => !areAnyStonesMined(game),
  "Tunnel Mole": (game) => !areAnyStonesMined(game),
  "Rocky the Mole": (game) => !areAnyIronsMined(game),
  Nugget: (game) => !areAnyGoldsMined(game),
  "Heart of Davy Jones": (game) => !areAnyTreasureHolesDug(game),
  "Iron Idol": (game) => !areAnyIronsMined(game),
  "Squirrel Monkey": (game) => !areFruitsGrowing(game, "Orange"),
  "Black Bearry": (game) => !areFruitsGrowing(game, "Blueberry"),

  "Pirate Bounty": false,
  Pearl: false,
  Coral: false,
  "Clam Shell": false,
  Pipi: false,
  Starfish: false,
  Seaweed: false,
  "Sea Cucumber": false,
  Crab: false,
  "Pirate Cake": false,

  //Enable after beta testing
  "Abandoned Bear": false,
  "Turtle Bear": false,
  "T-Rex Skull": true,
  "Sunflower Coin": true,
  Foliant: false,
  "Skeleton King Staff": false,
  "Lifeguard Bear": false,
  "Snorkel Bear": false,
  "Parasaur Skull": false,
  "Golden Bear Head": false,
  "Pirate Bear": true,
  "Goblin Bear": false,
  Galleon: false,
  "Dinosaur Bone": false,
  "Human Bear": false,
  "Wooden Compass": false,
  "Whale Bear": true,

  // Seasonal items
  "Beach Ball": false,
  "Palm Tree": false,
  Karkinos: false,
  "Cabbage Boy": false,
  "Cabbage Girl": false,
  "Collectible Bear": false,

  "Basic Land": false,
};

// Explicit false check is important, as we also want to check if it's a bool.
export const isNeverWithdrawable = (itemName: InventoryItemName) =>
  WITHDRAWABLES[itemName] === false;
