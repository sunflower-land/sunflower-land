import { KNOWN_IDS } from ".";
import { GoblinState } from "features/game/lib/goblinMachine";
import { canChop } from "features/game/events/chop";
import { canMine as canMineStone } from "features/game/events/stoneMine";
import { canMine as canMineIron } from "features/game/events/ironMine";
import { canMine as canMineGold } from "features/game/events/goldMine";
import { CROPS, CROP_SEEDS } from "./crops";
import { Inventory, InventoryItemName } from "./game";
import { getKeys } from "./craftables";
import { RESOURCES } from "./resources";

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

// Everything is non-withdawable by default
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

// Helper functions
type CanWithdrawArgs = {
  item: InventoryItemName;
  game: GoblinState;
};

function cropIsPlanted({ item, game }: CanWithdrawArgs): boolean {
  if (!game.fields) return false;

  const isPlanted = Object.values(game.fields).some(
    (field) => field.name === item
  );
  return isPlanted;
}

function areAnyCropsPlanted(game: GoblinState): boolean {
  return Object.values(game.fields).length > 0;
}

function areAnyTreesChopped(game: GoblinState): boolean {
  return Object.values(game?.trees).some((tree) => !canChop(tree));
}

function areAnyStonesMined(game: GoblinState): boolean {
  return Object.values(game?.stones).some((stone) => !canMineStone(stone));
}

function areAnyIronsMined(game: GoblinState): boolean {
  return Object.values(game?.iron).some((iron) => !canMineIron(iron));
}

function areAnyGoldsMined(game: GoblinState): boolean {
  return Object.values(game?.gold).some((gold) => !canMineGold(gold));
}

function hasSeeds(inventory: Inventory) {
  return getKeys(inventory).some((name) => name in CROP_SEEDS());
}

export const WITHDRAWABLES: Record<InventoryItemName, WithdrawCondition> = {
  ...globalDefaults,
  ...cropDefaults,
  ...resourceDefaults,
  Chicken: false,
  "Easter Bunny": (game) => !cropIsPlanted({ item: "Carrot", game }),
  "Golden Cauliflower": (game) => !cropIsPlanted({ item: "Cauliflower", game }),
  "Mysterious Parsnip": (game) => !cropIsPlanted({ item: "Parsnip", game }),
  Nancy: (game) => !areAnyCropsPlanted(game),
  Scarecrow: (game) => !areAnyCropsPlanted(game),
  Kuebiko: (game) => !areAnyCropsPlanted(game) && !hasSeeds(game.inventory),
  "Woody the Beaver": (game) => !areAnyTreesChopped(game),
  "Apprentice Beaver": (game) => !areAnyTreesChopped(game),
  "Foreman Beaver": (game) => !areAnyTreesChopped(game),
  "Tunnel Mole": (game) => !areAnyStonesMined(game),
  "Rocky the Mole": (game) => !areAnyIronsMined(game),
  Nugget: (game) => !areAnyGoldsMined(game),
};
