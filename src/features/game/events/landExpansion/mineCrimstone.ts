import Decimal from "decimal.js-light";
import { CRIMSTONE_RECOVERY_TIME } from "features/game/lib/constants";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { FiniteResource, GameState, Rock } from "../../types/game";
import { isWearableActive } from "features/game/lib/wearables";
import { produce } from "immer";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

export type MineCrimstoneAction = {
  type: "crimstoneRock.mined";
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: MineCrimstoneAction;
  createdAt?: number;
};

export function canMine(rock: Rock, now: number = Date.now()) {
  const recoveryTime = CRIMSTONE_RECOVERY_TIME;
  return now - rock.stone.minedAt > recoveryTime * 1000;
}

type GetMinedAtArgs = {
  createdAt: number;
  game: GameState;
};

export function getMinedAt({ createdAt, game }: GetMinedAtArgs): number {
  let time = createdAt;

  if (isWearableActive({ name: "Crimstone Amulet", game })) {
    time -= CRIMSTONE_RECOVERY_TIME * 0.2 * 1000;
  }

  if (game.bumpkin.skills["Fireside Alchemist"]) {
    time -= CRIMSTONE_RECOVERY_TIME * 0.15 * 1000;
  }

  return time;
}

export function getCrimstoneDropAmount({
  game,
  rock,
}: {
  game: GameState;
  rock: FiniteResource;
}) {
  let amount = new Decimal(1);

  if (isCollectibleBuilt({ name: "Crimson Carp", game })) {
    amount = amount.add(0.05);
  }

  if (isCollectibleBuilt({ name: "Crim Peckster", game })) {
    amount = amount.add(0.1);
  }

  if (isWearableActive({ name: "Crimstone Armor", game })) {
    amount = amount.add(0.1);
  }

  if (rock.minesLeft === 1) {
    if (isWearableActive({ name: "Crimstone Hammer", game })) {
      amount = amount.add(2);
    }
    if (game.bumpkin.skills["Fire Kissed"]) {
      amount = amount.add(1);
    }
    amount = amount.add(2);
  }

  return amount.toDecimalPlaces(4);
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

    if (!canMine(rock, createdAt)) {
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

    const stoneMined = getCrimstoneDropAmount({ game: stateCopy, rock });
    const amountInInventory = stateCopy.inventory.Crimstone || new Decimal(0);

    rock.stone = {
      minedAt: getMinedAt({ createdAt, game: stateCopy }),
    };

    rock.minesLeft = rock.minesLeft - 1;

    if (rock.minesLeft === 0) {
      rock.minesLeft = 5;
    }

    stateCopy.inventory["Gold Pickaxe"] = toolAmount.sub(1);
    stateCopy.inventory.Crimstone = amountInInventory.add(stoneMined);

    bumpkin.activity = trackActivity("Crimstone Mined", bumpkin.activity);

    return stateCopy;
  });
}
