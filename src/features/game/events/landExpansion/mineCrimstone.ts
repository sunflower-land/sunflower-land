import Decimal from "decimal.js-light";
import { CRIMSTONE_RECOVERY_TIME } from "features/game/lib/constants";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { canMine } from "features/game/lib/resourceNodes";
import { BoostName, FiniteResource, GameState } from "../../types/game";
import { isWearableActive } from "features/game/lib/wearables";
import { produce } from "immer";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";

export type MineCrimstoneAction = {
  type: "crimstoneRock.mined";
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: MineCrimstoneAction;
  createdAt?: number;
  farmId: number;
};

type PrngArgs = {
  farmId: number;
  itemId: number;
  counter: number;
};

type GetMinedAtArgs = {
  createdAt: number;
  game: GameState;
  prngArgs?: PrngArgs;
};

/**
 * Single source of truth for crimstone recovery boosts. Used by both getMinedAt (game) and UI.
 * When prngArgs is omitted, PRNG-dependent branches (e.g. Crimstone Clam instant) are skipped.
 */
export function getCrimstoneRecoveryTimeForDisplay({
  game,
  prngArgs,
}: {
  game: GameState;
  prngArgs?: PrngArgs;
}): {
  baseTimeMs: number;
  recoveryTimeMs: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const baseTimeMs = CRIMSTONE_RECOVERY_TIME * 1000;
  let totalSeconds = CRIMSTONE_RECOVERY_TIME;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (
    isCollectibleBuilt({ name: "Crimstone Clam", game }) &&
    prngArgs &&
    prngChance({
      ...prngArgs,
      chance: 10,
      criticalHitName: "Crimstone Clam",
    })
  ) {
    return {
      baseTimeMs,
      recoveryTimeMs: 0,
      boostsUsed: [{ name: "Crimstone Clam", value: "Instant" }],
    };
  }

  if (isCollectibleBuilt({ name: "Crimstone Clam", game })) {
    totalSeconds = totalSeconds * 0.9;
    boostsUsed.push({ name: "Crimstone Clam", value: "x0.9" });
  }

  if (isWearableActive({ name: "Crimstone Amulet", game })) {
    totalSeconds = totalSeconds * 0.8;
    boostsUsed.push({ name: "Crimstone Amulet", value: "x0.8" });
  }

  if (game.bumpkin.skills["Fireside Alchemist"]) {
    totalSeconds = totalSeconds * 0.85;
    boostsUsed.push({ name: "Fireside Alchemist", value: "x0.85" });
  }

  if (isTemporaryCollectibleActive({ name: "Mole Shrine", game })) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push({ name: "Mole Shrine", value: "x0.75" });
  }

  return {
    baseTimeMs,
    recoveryTimeMs: totalSeconds * 1000,
    boostsUsed,
  };
}

/**
 * Set a mined in the past to make it replenish faster. Uses getCrimstoneRecoveryTimeForDisplay for boost logic.
 */
export function getMinedAt({ createdAt, game, prngArgs }: GetMinedAtArgs): {
  time: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { baseTimeMs, recoveryTimeMs, boostsUsed } =
    getCrimstoneRecoveryTimeForDisplay({ game, prngArgs });
  const buffMs = baseTimeMs - recoveryTimeMs;
  return { time: createdAt - buffMs, boostsUsed };
}

export function getCrimstoneDropAmount({
  game,
  rock,
}: {
  game: GameState;
  rock: FiniteResource;
}): { amount: Decimal; boostsUsed: { name: BoostName; value: string }[] } {
  let amount = new Decimal(1);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isCollectibleBuilt({ name: "Crimson Carp", game })) {
    amount = amount.add(0.05);
    boostsUsed.push({ name: "Crimson Carp", value: "+0.05" });
  }

  if (isCollectibleBuilt({ name: "Crim Peckster", game })) {
    amount = amount.add(0.1);
    boostsUsed.push({ name: "Crim Peckster", value: "+0.1" });
  }

  if (isWearableActive({ name: "Crimstone Armor", game })) {
    amount = amount.add(0.1);
    boostsUsed.push({ name: "Crimstone Armor", value: "+0.1" });
  }

  if (rock.minesLeft === 1) {
    if (isWearableActive({ name: "Crimstone Hammer", game })) {
      amount = amount.add(2);
      boostsUsed.push({ name: "Crimstone Hammer", value: "+2" });
    }
    if (game.bumpkin.skills["Fire Kissed"]) {
      amount = amount.add(1);
      boostsUsed.push({ name: "Fire Kissed", value: "+1" });
    }
    amount = amount.add(2);
    boostsUsed.push({ name: "Streak Bonus", value: "+2" });
  }

  return { amount: amount.toDecimalPlaces(4), boostsUsed };
}

export function mineCrimstone({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { crimstones, bumpkin } = stateCopy;
    const rock = crimstones?.[action.index];

    if (!rock) {
      throw new Error("Crimstone does not exist");
    }

    if (bumpkin === undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    if (rock.x === undefined && rock.y === undefined) {
      throw new Error("Crimstone rock is not placed");
    }

    if (!canMine(rock, "Crimstone Rock", createdAt)) {
      throw new Error("Rock is still recovering");
    }

    const toolAmount = stateCopy.inventory["Gold Pickaxe"] || new Decimal(0);
    const pickaxeBoosts: { name: BoostName; value: string }[] = [];
    const hasCrimstoneSpikes = isWearableActive({
      name: "Crimstone Spikes Hair",
      game: stateCopy,
    });

    if (!hasCrimstoneSpikes && toolAmount.lessThan(1)) {
      throw new Error("No gold pickaxes left");
    }

    // if last minedAt is more than CRIMSTONE_RECOVERY_TIME + 24hrs, reset minesLeft to 5
    // else, decrement minesLeft by 1
    const twentyFourHrs = 24 * 60 * 60;

    const timeToReset = (CRIMSTONE_RECOVERY_TIME + twentyFourHrs) * 1000;

    if (createdAt - rock.stone.minedAt > timeToReset) {
      rock.minesLeft = 5;
    }

    const counter = stateCopy.farmActivity["Crimstone Mined"] ?? 0;
    const prngObject = {
      farmId,
      itemId: KNOWN_IDS["Crimstone Rock"],
      counter,
    };
    const { amount: stoneMined, boostsUsed } = getCrimstoneDropAmount({
      game: stateCopy,
      rock,
    });
    const amountInInventory = stateCopy.inventory.Crimstone || new Decimal(0);

    const { time, boostsUsed: minedAtBoostsUsed } = getMinedAt({
      createdAt,
      game: stateCopy,
      prngArgs: prngObject,
    });
    rock.stone = { minedAt: time };

    rock.minesLeft = rock.minesLeft - 1;

    if (rock.minesLeft === 0) {
      rock.minesLeft = 5;
    }

    if (hasCrimstoneSpikes) {
      pickaxeBoosts.push({ name: "Crimstone Spikes Hair", value: "Free" });
    } else {
      stateCopy.inventory["Gold Pickaxe"] = toolAmount.sub(1);
    }
    stateCopy.inventory.Crimstone = amountInInventory.add(stoneMined);

    stateCopy.farmActivity = trackFarmActivity(
      "Crimstone Mined",
      stateCopy.farmActivity,
    );

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [...boostsUsed, ...minedAtBoostsUsed, ...pickaxeBoosts],
      createdAt,
    });

    return stateCopy;
  });
}
