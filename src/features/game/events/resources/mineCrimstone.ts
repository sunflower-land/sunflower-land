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

export type MineCrimstoneAction = {
  type: "crimstoneRock.mined";
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: MineCrimstoneAction;
  createdAt?: number;
};

type GetMinedAtArgs = {
  createdAt: number;
  game: GameState;
};

function getBoostedTime({ game }: GetMinedAtArgs): {
  boostedTime: number;
  boostsUsed: BoostName[];
} {
  let totalSeconds = CRIMSTONE_RECOVERY_TIME;
  const boostsUsed: BoostName[] = [];

  if (isWearableActive({ name: "Crimstone Amulet", game })) {
    totalSeconds = totalSeconds * 0.8;
    boostsUsed.push("Crimstone Amulet");
  }

  if (game.bumpkin.skills["Fireside Alchemist"]) {
    totalSeconds = totalSeconds * 0.85;
    boostsUsed.push("Fireside Alchemist");
  }

  if (isTemporaryCollectibleActive({ name: "Mole Shrine", game })) {
    totalSeconds = totalSeconds * 0.75;
    boostsUsed.push("Mole Shrine");
  }

  const buff = CRIMSTONE_RECOVERY_TIME - totalSeconds;

  return { boostedTime: buff * 1000, boostsUsed };
}

export function getMinedAt({ createdAt, game }: GetMinedAtArgs): {
  time: number;
  boostsUsed: BoostName[];
} {
  const { boostedTime, boostsUsed } = getBoostedTime({ game, createdAt });

  const time = createdAt - boostedTime;

  return { time, boostsUsed };
}

export function getCrimstoneDropAmount({
  game,
  rock,
}: {
  game: GameState;
  rock: FiniteResource;
}): { amount: Decimal; boostsUsed: BoostName[] } {
  let amount = new Decimal(1);
  const boostsUsed: BoostName[] = [];

  if (isCollectibleBuilt({ name: "Crimson Carp", game })) {
    amount = amount.add(0.05);
    boostsUsed.push("Crimson Carp");
  }

  if (isCollectibleBuilt({ name: "Crim Peckster", game })) {
    amount = amount.add(0.1);
    boostsUsed.push("Crim Peckster");
  }

  if (isWearableActive({ name: "Crimstone Armor", game })) {
    amount = amount.add(0.1);
    boostsUsed.push("Crimstone Armor");
  }

  if (rock.minesLeft === 1) {
    if (isWearableActive({ name: "Crimstone Hammer", game })) {
      amount = amount.add(2);
      boostsUsed.push("Crimstone Hammer");
    }
    if (game.bumpkin.skills["Fire Kissed"]) {
      amount = amount.add(1);
      boostsUsed.push("Fire Kissed");
    }
    amount = amount.add(2);
  }

  return { amount: amount.toDecimalPlaces(4), boostsUsed };
}

export function mineCrimstone({
  state,
  action,
  createdAt = Date.now(),
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

    if (toolAmount.lessThan(1)) {
      throw new Error("No gold pickaxes left");
    }

    // if last minedAt is more than CRIMSTONE_RECOVERY_TIME + 24hrs, reset minesLeft to 5
    // else, decrement minesLeft by 1
    const twentyFourHrs = 24 * 60 * 60;

    const timeToReset = (CRIMSTONE_RECOVERY_TIME + twentyFourHrs) * 1000;

    if (createdAt - rock.stone.minedAt > timeToReset) {
      rock.minesLeft = 5;
    }

    const { amount: stoneMined, boostsUsed } = getCrimstoneDropAmount({
      game: stateCopy,
      rock,
    });
    const amountInInventory = stateCopy.inventory.Crimstone || new Decimal(0);

    const { time, boostsUsed: minedAtBoostsUsed } = getMinedAt({
      createdAt,
      game: stateCopy,
    });
    rock.stone = { minedAt: time };

    rock.minesLeft = rock.minesLeft - 1;

    if (rock.minesLeft === 0) {
      rock.minesLeft = 5;
    }

    stateCopy.inventory["Gold Pickaxe"] = toolAmount.sub(1);
    stateCopy.inventory.Crimstone = amountInInventory.add(stoneMined);

    stateCopy.farmActivity = trackFarmActivity(
      "Crimstone Mined",
      stateCopy.farmActivity,
    );

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [...boostsUsed, ...minedAtBoostsUsed],
      createdAt,
    });

    return stateCopy;
  });
}
