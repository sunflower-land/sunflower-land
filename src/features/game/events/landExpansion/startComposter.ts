import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  ComposterName,
  SEASON_COMPOST_REQUIREMENTS,
  composterDetails,
} from "features/game/types/composters";
import { getKeys } from "features/game/types/craftables";
import {
  CompostBuilding,
  GameState,
  InventoryItemName,
  Skills,
} from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";

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
}) {
  let { timeToFinishMilliseconds } = composterDetails[composter];

  // gives +10% speed boost if the player has the Soil Krabby
  if (isCollectibleBuilt({ name: "Soil Krabby", game: gameState })) {
    timeToFinishMilliseconds = timeToFinishMilliseconds * 0.9;
  }

  // gives +10% speed boost if the player has Swift Decomposer skill
  if (gameState.bumpkin?.skills["Swift Decomposer"]) {
    timeToFinishMilliseconds = timeToFinishMilliseconds * 0.9;
  }

  return { timeToFinishMilliseconds };
}

export function getCompostAmount({
  skills,
  building,
}: {
  skills: Skills;
  building: ComposterName;
}) {
  let { produceAmount } = composterDetails[building];

  if (skills["Efficient Bin"] && building === "Compost Bin") {
    produceAmount += 5;
  }

  if (skills["Turbo Charged"] && building === "Turbo Composter") {
    produceAmount += 5;
  }

  if (skills["Premium Worms"] && building === "Premium Composter") {
    produceAmount += 10;
  }

  if (skills["Composting Overhaul"]) {
    produceAmount -= 5;
  }

  if (skills["Composting Revamp"]) {
    produceAmount += 5;
  }

  return { produceAmount };
}

export function startComposter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { building } = action;
    const buildings = stateCopy.buildings[building] as CompostBuilding[];
    if (!buildings) {
      throw new Error(translate("error.composterNotExist"));
    }

    const { bumpkin, inventory } = stateCopy;
    const { skills } = bumpkin;
    const composter = buildings[0];
    const { producing } = composter;

    if (producing && producing.readyAt > createdAt) {
      throw new Error(translate("error.alr.composter"));
    }

    const requires = hasFeatureAccess(stateCopy, "WEATHER_SHOP")
      ? SEASON_COMPOST_REQUIREMENTS[building][stateCopy.season.season]
      : composter.requires;

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

    const { produceAmount } = getCompostAmount({
      skills,
      building,
    });
    const { timeToFinishMilliseconds } = getReadyAt({
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

    return stateCopy;
  });
}
