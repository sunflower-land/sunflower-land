import { KNOWN_IDS } from ".";
import { GoblinState } from "features/game/lib/goblinMachine";
import { CHICKEN_TIME_TO_EGG } from "features/game/lib/constants";
import { CROPS, CROP_SEEDS } from "./crops";
import { EASTER_EGGS, Inventory, InventoryItemName } from "./game";
import { FLAGS, getKeys, MUTANT_CHICKENS } from "./craftables";
import { RESOURCES } from "./resources";
import { canChop } from "../events/landExpansion/chop";
import { canMine } from "../events/landExpansion/stoneMine";

type WithdrawCondition = boolean | ((gameState: GoblinState) => boolean);

// Helps build withdraw rules for item groups
function buildDefaults(
  itemNames: string[],
  withdrawCondition: WithdrawCondition
): Partial<Record<InventoryItemName, WithdrawCondition>> {
  return itemNames.reduce(
    (prev, cur) => ({
      ...prev,
      [cur]: withdrawCondition,
    }),
    {}
  );
}

// Helper functions
type CanWithdrawArgs = {
  item: InventoryItemName;
  game: GoblinState;
};

function cropIsPlanted({ item, game }: CanWithdrawArgs): boolean {
  return Object.values(game.fields).some((field) => field.name === item);
}

function hasSeeds(inventory: Inventory) {
  return getKeys(inventory).some((name) => name in CROP_SEEDS());
}

function areAnyCropsPlanted(game: GoblinState): boolean {
  return Object.values(game.fields).length > 0;
}

function areAnyTreesChopped(game: GoblinState): boolean {
  return Object.values(game?.expansions).some((expansion) =>
    Object.values(expansion.trees ?? {}).some((tree) => !canChop(tree))
  );
}

function areAnyStonesMined(game: GoblinState): boolean {
  return Object.values(game?.expansions).some((expansion) =>
    Object.values(expansion.stones ?? {}).some((stone) => !canMine(stone))
  );
}

function areAnyIronsMined(game: GoblinState): boolean {
  return Object.values(game?.expansions).some((expansion) =>
    Object.values(expansion.iron ?? {}).some((iron) => !canMine(iron))
  );
}

function areAnyGoldsMined(game: GoblinState): boolean {
  return Object.values(game?.expansions).some((expansion) =>
    Object.values(expansion.gold ?? {}).some((gold) => !canMine(gold))
  );
}

function areAnyChickensFed(game: GoblinState): boolean {
  return Object.values(game.chickens).some(
    (chicken) =>
      chicken.fedAt && Date.now() - chicken.fedAt < CHICKEN_TIME_TO_EGG
  );
}

// Everything is non-withdrawable by default
const globalDefaults = Object.keys(KNOWN_IDS).reduce(
  (prev, cur) => ({
    ...prev,
    [cur]: false,
  }),
  {}
) as Record<InventoryItemName, WithdrawCondition>;

// Group withdraw conditions for common items
const cropDefaults = buildDefaults(Object.keys(CROPS()), true);
const resourceDefaults = buildDefaults(Object.keys(RESOURCES), true);
const mutantChickenDefaults = buildDefaults(
  Object.keys(MUTANT_CHICKENS),
  (game) => !areAnyChickensFed(game)
);
const flagDefaults = buildDefaults(Object.keys(FLAGS), true);
const easterEggDefaults = buildDefaults([...EASTER_EGGS, "Egg Basket"], true);

export const WITHDRAWABLES: Record<InventoryItemName, WithdrawCondition> = {
  ...globalDefaults,
  ...cropDefaults,
  ...resourceDefaults,
  ...mutantChickenDefaults,
  ...flagDefaults,
  ...easterEggDefaults,

  // Explicit Rules
  Chicken: false, // Temporarily disabled until land expansion
  "Farm Cat": true,
  "Farm Dog": true,
  "Gold Egg": true,
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
  Observatory: true,

  // Conditional Rules
  "Chicken Coop": (game) => !areAnyChickensFed(game),
  Rooster: (game) => !areAnyChickensFed(game),
  "Easter Bunny": (game) => !cropIsPlanted({ item: "Carrot", game }),
  "Golden Cauliflower": (game) => !cropIsPlanted({ item: "Cauliflower", game }),
  "Mysterious Parsnip": (game) => !cropIsPlanted({ item: "Parsnip", game }),
  "Victoria Sisters": (game) => !cropIsPlanted({ item: "Pumpkin", game }),
  "Carrot Sword": (game) => !areAnyCropsPlanted(game),
  Nancy: (game) => !areAnyCropsPlanted(game),
  Scarecrow: (game) => !areAnyCropsPlanted(game),
  Kuebiko: (game) => !areAnyCropsPlanted(game) && !hasSeeds(game.inventory),
  "Woody the Beaver": (game) => !areAnyTreesChopped(game),
  "Apprentice Beaver": (game) => !areAnyTreesChopped(game),
  "Foreman Beaver": (game) => !areAnyTreesChopped(game),
  "Rock Golem": (game) => !areAnyStonesMined(game),
  "Tunnel Mole": (game) => !areAnyStonesMined(game),
  "Rocky the Mole": (game) => !areAnyIronsMined(game),
  Nugget: (game) => !areAnyGoldsMined(game),
};

// Explicit false check is important, as we also want to check if it's a bool.
export const isNeverWithdrawable = (itemName: InventoryItemName) =>
  WITHDRAWABLES[itemName] === false;
