import { canChop } from "features/game/events/chop";
import { isSeed } from "features/game/events/plant";
import { canMine as canMineStone } from "features/game/events/stoneMine";
import { canMine as canMineIron } from "features/game/events/ironMine";
import { canMine as canMineGold } from "features/game/events/goldMine";
import { CHICKEN_TIME_TO_EGG } from "features/game/lib/constants";
import { GoblinState } from "features/game/lib/goblinMachine";
import {
  FOODS,
  getKeys,
  QUEST_ITEMS,
  SHOVELS,
} from "features/game/types/craftables";
import { SEEDS } from "features/game/types/crops";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { SKILL_TREE } from "features/game/types/skills";

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

function hasSeeds(inventory: Inventory) {
  return getKeys(inventory).some((name) => name in SEEDS());
}

function hasFedChickens(game: GoblinState): boolean {
  if (!game.chickens) return false;

  const hasFedChickens = Object.values(game.chickens).some(
    (chicken) =>
      chicken.fedAt && Date.now() - chicken.fedAt < CHICKEN_TIME_TO_EGG
  );

  return hasFedChickens;
}

export function canWithdraw({ item, game }: CanWithdrawArgs) {
  // Coming soon
  if (isSeed(item)) {
    return false;
  }

  // Coming soon
  if (item in SKILL_TREE) {
    return false;
  }

  // Coming soon
  if (item in FOODS()) {
    return false;
  }

  // Quest item
  if (item in QUEST_ITEMS) {
    return false;
  }

  if (item === "Engine Core" || item == "Observatory") {
    return false;
  }

  if (item in SHOVELS) {
    return false;
  }

  // Temporarily disable until land expansion
  if (item === "Chicken") {
    return false;
  }

  // Make sure no trees are replenishing
  if (
    item === "Woody the Beaver" ||
    item === "Apprentice Beaver" ||
    item === "Foreman Beaver"
  ) {
    return Object.values(game?.trees).every((tree) => canChop(tree));
  }

  if (item === "Kuebiko" && hasSeeds(game.inventory)) {
    return false;
  }

  // Make sure no crops are planted
  if (item === "Scarecrow" || item === "Nancy" || item === "Kuebiko") {
    return Object.values(game.fields).length === 0;
  }

  if (item === "Easter Bunny") {
    return !cropIsPlanted({ item: "Carrot", game });
  }

  if (item === "Golden Cauliflower") {
    return !cropIsPlanted({ item: "Cauliflower", game });
  }

  if (item === "Mysterious Parsnip") {
    return !cropIsPlanted({ item: "Parsnip", game });
  }

  if (
    item === "Chicken Coop" ||
    item === "Fat Chicken" ||
    item === "Speed Chicken" ||
    item === "Rich Chicken"
  ) {
    return !hasFedChickens(game);
  }

  // Make sure stones are not replenishing
  if (item === "Tunnel Mole") {
    const stoneReady = Object.values(game?.stones).every((stone) =>
      canMineStone(stone)
    );
    return stoneReady;
  }

  // Make sure irons are not replenishing
  if (item === "Rocky the Mole") {
    const ironReady = Object.values(game?.iron).every((iron) =>
      canMineIron(iron)
    );
    return ironReady;
  }

  // Make sure gold is not replenishing
  if (item === "Nugget") {
    const goldReady = Object.values(game?.gold).every((gold) =>
      canMineGold(gold)
    );
    return goldReady;
  }

  if (item === "Human War Banner" || item === "Goblin War Banner") return false;

  // War Bond
  if (item === "War Bond") return false;

  //Rapid Growth
  if (item === "Rapid Growth") return false;

  //Chef Hat
  if (item === "Chef Hat") return false;

  // War items
  if (
    item === "Human War Point" ||
    item === "Goblin War Point" ||
    item === "Sunflower Amulet" ||
    item === "Carrot Amulet" ||
    item === "Beetroot Amulet" ||
    item === "Green Amulet" ||
    item === "Warrior Shirt" ||
    item === "Warrior Pants" ||
    item === "Warrior Helmet"
  ) {
    return false;
  }

  // Tools, Crops, Resources
  return true;
}
