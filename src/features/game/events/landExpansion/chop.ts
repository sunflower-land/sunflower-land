import Decimal from "decimal.js-light";
import {
  isCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { TREE_RECOVERY_TIME } from "features/game/lib/constants";
import { FACTION_ITEMS } from "features/game/lib/factions";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";
import { isWearableActive } from "features/game/lib/wearables";
import { trackActivity } from "features/game/types/bumpkinActivity";

import {
  BoostName,
  CriticalHitName,
  GameState,
  Inventory,
  InventoryItemName,
  Tree,
} from "features/game/types/game";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { produce } from "immer";

export enum CHOP_ERRORS {
  MISSING_AXE = "No axe",
  NO_AXES = "No axes left",
  NO_TREE = "No tree",
  STILL_GROWING = "Tree is still growing",
}

type GetChoppedAtArgs = {
  game: GameState;
  createdAt: number;
};

export type LandExpansionChopAction = {
  type: "timber.chopped";
  index: string;
  item: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionChopAction;
  createdAt?: number;
};

export function canChop(tree: Tree, now: number = Date.now()) {
  return now - tree.wood.choppedAt > TREE_RECOVERY_TIME * 1000;
}

/**
 * Sets the drop amount for the current chop event on the tree
 */
export function getWoodDropAmount({
  criticalDropGenerator = () => false,
  game,
}: {
  game: GameState;
  criticalDropGenerator?: (name: CriticalHitName) => boolean;
}): { amount: Decimal; boostsUsed: BoostName[] } {
  const { bumpkin, inventory } = game;
  let amount = new Decimal(1);
  const boostsUsed: BoostName[] = [];

  const hasWoodyTheBeaver = isCollectibleBuilt({
    name: "Woody the Beaver",
    game,
  });
  const hasApprenticeBeaver = isCollectibleBuilt({
    name: "Apprentice Beaver",
    game,
  });
  const hasForemanBeaver = isCollectibleBuilt({
    name: "Foreman Beaver",
    game,
  });

  const hasBeaverReady =
    hasWoodyTheBeaver || hasApprenticeBeaver || hasForemanBeaver;

  if (hasBeaverReady) {
    amount = amount.mul(1.2);
    if (hasForemanBeaver) boostsUsed.push("Foreman Beaver");
    else if (hasApprenticeBeaver) boostsUsed.push("Apprentice Beaver");
    else if (hasWoodyTheBeaver) boostsUsed.push("Woody the Beaver");
  }

  if (inventory["Discord Mod"]) {
    amount = amount.mul(1.35);
    boostsUsed.push("Discord Mod");
  }

  if (inventory.Lumberjack) {
    amount = amount.mul(1.1);
    boostsUsed.push("Lumberjack");
  }

  if (bumpkin.skills["Tough Tree"] && criticalDropGenerator("Tough Tree")) {
    amount = amount.mul(3);
    boostsUsed.push("Tough Tree");
  }

  if (bumpkin.skills["Lumberjack's Extra"]) {
    amount = amount.add(0.1);
    boostsUsed.push("Lumberjack's Extra");
  }

  if (isCollectibleBuilt({ name: "Wood Nymph Wendy", game })) {
    amount = amount.add(0.2);
    boostsUsed.push("Wood Nymph Wendy");
  }

  //If Tiki Totem: bonus 0.1
  if (isCollectibleBuilt({ name: "Tiki Totem", game })) {
    amount = amount.add(0.1);
    boostsUsed.push("Tiki Totem");
  }

  if (isCollectibleBuilt({ name: "Squirrel", game })) {
    amount = amount.add(0.1);
    boostsUsed.push("Squirrel");
  }

  // Apply the faction shield boost if in the right faction
  const factionName = game.faction?.name;
  if (
    factionName &&
    isWearableActive({
      game,
      name: FACTION_ITEMS[factionName].secondaryTool,
    })
  ) {
    amount = amount.add(0.25);
    boostsUsed.push(FACTION_ITEMS[factionName].secondaryTool);
  }

  // Native 1 in 5 chance of getting 1 extra wood
  if (criticalDropGenerator("Native")) {
    amount = amount.add(1);
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(game.buds ?? {}, "Wood");
  amount = amount.add(yieldBoost);
  if (budUsed) boostsUsed.push(budUsed);

  return { amount: amount.toDecimalPlaces(4), boostsUsed };
}

/**
 * Set a chopped in the past to make it replenish faster
 */
export function getChoppedAt({ game, createdAt }: GetChoppedAtArgs): {
  time: number;
  boostsUsed: BoostName[];
} {
  const { bumpkin } = game;
  let totalSeconds = TREE_RECOVERY_TIME;
  const boostsUsed: BoostName[] = [];

  const hasApprenticeBeaver = isCollectibleBuilt({
    name: "Apprentice Beaver",
    game,
  });
  const hasForemanBeaver = isCollectibleBuilt({
    name: "Foreman Beaver",
    game,
  });

  const hasBeaverReady = hasApprenticeBeaver || hasForemanBeaver;

  if (hasBeaverReady) {
    totalSeconds = totalSeconds * 0.5;
    if (hasForemanBeaver) boostsUsed.push("Foreman Beaver");
    else if (hasApprenticeBeaver) boostsUsed.push("Apprentice Beaver");
  }

  if (bumpkin.skills["Tree Charge"]) {
    boostsUsed.push("Tree Charge");
    totalSeconds = totalSeconds * 0.9;
  }

  const hasSuperTotem = isCollectibleActive({
    name: "Super Totem",
    game,
  });
  const hasTimeWarpTotem = isCollectibleActive({
    name: "Time Warp Totem",
    game,
  });

  const hasSuperTotemOrTimeWarpTotem = hasSuperTotem || hasTimeWarpTotem;

  if (hasSuperTotemOrTimeWarpTotem) {
    totalSeconds = totalSeconds * 0.5;
    if (hasSuperTotem) boostsUsed.push("Super Totem");
    else if (hasTimeWarpTotem) boostsUsed.push("Time Warp Totem");
  }

  if (isCollectibleActive({ name: "Timber Hourglass", game })) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push("Timber Hourglass");
  }

  if (isCollectibleActive({ name: "Badger Shrine", game })) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push("Badger Shrine");
  }

  const buff = TREE_RECOVERY_TIME - totalSeconds;

  return { time: createdAt - buff * 1000, boostsUsed };
}

/**
 * Returns the amount of axe required to chop down a tree
 */
export function getRequiredAxeAmount(
  inventory: Inventory,
  gameState: GameState,
) {
  const boostsUsed: BoostName[] = [];
  if (isCollectibleBuilt({ name: "Foreman Beaver", game: gameState })) {
    boostsUsed.push("Foreman Beaver");
    return { amount: new Decimal(0), boostsUsed };
  }

  if (inventory.Logger?.gte(1)) {
    boostsUsed.push("Logger");
    return { amount: new Decimal(0.5), boostsUsed };
  }

  return { amount: new Decimal(1), boostsUsed };
}

export function chop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { trees, bumpkin, inventory } = stateCopy;

    if (bumpkin === undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    const { amount: requiredAxes, boostsUsed: axeBoostsUsed } =
      getRequiredAxeAmount(state.inventory, state);

    const axeAmount = inventory.Axe || new Decimal(0);
    if (axeAmount.lessThan(requiredAxes)) {
      throw new Error(CHOP_ERRORS.NO_AXES);
    }

    const tree = trees[action.index];

    if (!tree) {
      throw new Error(CHOP_ERRORS.NO_TREE);
    }

    if (tree.x === undefined && tree.y === undefined) {
      throw new Error("Tree is not placed");
    }

    if (!canChop(tree, createdAt)) {
      throw new Error(CHOP_ERRORS.STILL_GROWING);
    }

    const { amount: woodHarvested, boostsUsed: woodHarvestedBoostsUsed } =
      tree.wood.amount !== undefined
        ? { amount: tree.wood.amount, boostsUsed: [] }
        : getWoodDropAmount({
            game: stateCopy,
            criticalDropGenerator: (name) =>
              !!(tree.wood.criticalHit?.[name] ?? 0),
          });
    const woodAmount = inventory.Wood || new Decimal(0);

    const { time, boostsUsed: choppedAtBoostsUsed } = getChoppedAt({
      createdAt,
      game: stateCopy,
    });

    tree.wood = { choppedAt: time };

    inventory.Axe = axeAmount.sub(requiredAxes);
    inventory.Wood = woodAmount.add(woodHarvested);

    bumpkin.activity = trackActivity("Tree Chopped", bumpkin.activity);
    delete tree.wood.amount;

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [
        ...choppedAtBoostsUsed,
        ...woodHarvestedBoostsUsed,
        ...axeBoostsUsed,
      ],
      createdAt,
    });
    return stateCopy;
  });
}
