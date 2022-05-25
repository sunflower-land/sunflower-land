import { canChop } from "features/game/events/chop";
import { isSeed } from "features/game/events/plant";
import { canMine } from "features/game/events/stoneMine";
import { GoblinState } from "features/game/lib/goblinMachine";
import { FOODS, getKeys } from "features/game/types/craftables";
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

  if (item === "Engine Core") {
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

  const stoneReady = Object.values(game?.stones).every((stone) =>
    canMine(stone)
  );

  // Make sure no stones are replenishing
  if (item === "Tunnel Mole") {
    return stoneReady;
  }

  const ironReady = Object.values(game?.iron).every((iron) => canMine(iron));

  // Make sure no stones or iron are replenishing
  if (item === "Rocky the Mole") {
    return ironReady && stoneReady;
  }

  const goldReady = Object.values(game?.gold).every((gold) => canMine(gold));

  // Make sure no stones, iron or gold are replenishing
  if (item === "Nugget") {
    return ironReady && stoneReady && goldReady;
  }

  // Tools, Crops, Resources
  return true;
}
