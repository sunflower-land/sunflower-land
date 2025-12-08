import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  ComposterName,
  SEASON_COMPOST_REQUIREMENTS,
  composterDetails,
} from "features/game/types/composters";
import { getKeys } from "features/game/types/craftables";
import {
  BoostName,
  CompostBuilding,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import { produce } from "immer";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { isWearableActive } from "features/game/lib/wearables";

export type StartComposterAction = {
  type: "composter.started";
  building: ComposterName;
};

type Options = {
  state: Readonly<GameState>;
  action: StartComposterAction;
  createdAt?: number;
};

export function getReadyAt({
  gameState,
  composter,
}: {
  gameState: GameState;
  composter: ComposterName;
}): { timeToFinishMilliseconds: number; boostsUsed: BoostName[] } {
  let { timeToFinishMilliseconds } = composterDetails[composter];
  const boostsUsed: BoostName[] = [];

  // gives +10% speed boost if the player has the Soil Krabby
  if (isCollectibleBuilt({ name: "Soil Krabby", game: gameState })) {
    timeToFinishMilliseconds = timeToFinishMilliseconds * 0.9;
    boostsUsed.push("Soil Krabby");
  }

  // gives +10% speed boost if the player has Swift Decomposer skill
  if (gameState.bumpkin?.skills["Swift Decomposer"]) {
    timeToFinishMilliseconds = timeToFinishMilliseconds * 0.9;
    boostsUsed.push("Swift Decomposer");
  }

  return { timeToFinishMilliseconds, boostsUsed };
}

export function getCompostAmount({
  game,
  building,
}: {
  game: GameState;
  building: ComposterName;
}): { produceAmount: number; boostsUsed: BoostName[] } {
  let { produceAmount } = composterDetails[building];
  const boostsUsed: BoostName[] = [];
  const { skills } = game.bumpkin;

  if (skills["Efficient Bin"] && building === "Compost Bin") {
    produceAmount += 5;
    boostsUsed.push("Efficient Bin");
  }

  if (skills["Turbo Charged"] && building === "Turbo Composter") {
    produceAmount += 5;
    boostsUsed.push("Turbo Charged");
  }

  if (skills["Premium Worms"] && building === "Premium Composter") {
    produceAmount += 10;
    boostsUsed.push("Premium Worms");
  }

  if (skills["Composting Overhaul"]) {
    produceAmount -= 5;
    boostsUsed.push("Composting Overhaul");
  }

  if (skills["Composting Revamp"]) {
    produceAmount += 5;
    boostsUsed.push("Composting Revamp");
  }

  if (isWearableActive({ game, name: "Turd Topper" })) {
    produceAmount += 1;
    boostsUsed.push("Turd Topper");
  }

  if (produceAmount < 0) {
    produceAmount = 0;
  }

  return { produceAmount, boostsUsed };
}

export function startComposter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { building } = action;
    const buildings = stateCopy.buildings[building] as CompostBuilding[];
    if (!buildings?.some((building) => !!building.coordinates)) {
      throw new Error(translate("error.composterNotExist"));
    }

    const { inventory } = stateCopy;
    const composter = buildings[0];
    const { producing } = composter;

    if (producing) {
      throw new Error(translate("error.alr.composter"));
    }

    const requires = {
      ...SEASON_COMPOST_REQUIREMENTS[building][stateCopy.season.season],
    };

    if (!requires) {
      throw new Error(translate("error.alr.composter"));
    }

    // remove the requirements from the player's inventory
    getKeys(requires ?? {}).forEach((name) => {
      const previous = inventory[name as InventoryItemName] || new Decimal(0);

      if (previous.lt(requires?.[name] ?? 0)) {
        throw new Error(translate("error.missing"));
      }

      inventory[name as InventoryItemName] = previous.minus(
        requires?.[name] ?? 0,
      );
    });

    const { produce, worm } = composterDetails[building];

    const { produceAmount, boostsUsed: composterBoostsUsed } = getCompostAmount(
      {
        game: stateCopy,
        building,
      },
    );
    const { timeToFinishMilliseconds, boostsUsed } = getReadyAt({
      gameState: stateCopy,
      composter: building,
    });

    // start the production
    buildings[0].producing = {
      items: {
        [produce]: produceAmount,
        // Set on backend
        [worm]: 1,
      },
      startedAt: createdAt,
      readyAt: createdAt + timeToFinishMilliseconds,
    };

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [...boostsUsed, ...composterBoostsUsed],
      createdAt,
    });

    return stateCopy;
  });
}
