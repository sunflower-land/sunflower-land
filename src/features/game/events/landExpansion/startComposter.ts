import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import { getKeys } from "features/game/types/craftables";
import {
  CompostBuilding,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import { produce } from "immer";

export type StartComposterAction = {
  type: "composter.started";
  building: ComposterName;
};

type Options = {
  state: Readonly<GameState>;
  action: StartComposterAction;
  createdAt?: number;
};

const getReadyAt = (gameState: GameState, composter: ComposterName) => {
  let timeToFinish = composterDetails(gameState.bumpkin.skills)[composter]
    .timeToFinishMilliseconds;

  // gives +10% speed boost if the player has the Soil Krabby
  if (isCollectibleBuilt({ name: "Soil Krabby", game: gameState })) {
    timeToFinish = timeToFinish * 0.9;
  }

  // gives +10% speed boost if the player has Swift Decomposer skill
  if (gameState.bumpkin?.skills["Swift Decomposer"]) {
    timeToFinish = timeToFinish * 0.9;
  }

  if (gameState.bumpkin.skills["Composting Bonanza"]) {
    timeToFinish = timeToFinish - 1 * 60 * 60 * 1000;
  }

  return timeToFinish;
};

export function startComposter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const buildings = stateCopy.buildings[action.building] as CompostBuilding[];
    if (!buildings) {
      throw new Error(translate("error.composterNotExist"));
    }

    const { skills } = stateCopy.bumpkin;
    const composter = buildings[0];
    const isProducing = composter.producing;

    if (isProducing && isProducing.readyAt > createdAt) {
      throw new Error(translate("error.alr.composter"));
    }

    if (!composter.requires) {
      throw new Error(translate("error.alr.composter"));
    }

    // remove the requirements from the player's inventory
    getKeys(composter.requires ?? {}).forEach((name) => {
      const previous =
        stateCopy.inventory[name as InventoryItemName] || new Decimal(0);

      if (previous.lt(composter.requires?.[name] ?? 0)) {
        throw new Error(translate("error.missing"));
      }

      stateCopy.inventory[name as InventoryItemName] = previous.minus(
        composter.requires?.[name] ?? 0,
      );
    });

    const produce = composterDetails(stateCopy.bumpkin.skills)[action.building]
      .produce;
    let produceAmount = composterDetails(stateCopy.bumpkin.skills)[
      action.building
    ].produceAmount;

    if (skills["Efficient Bin"] && action.building === "Compost Bin") {
      produceAmount += 5;
    }

    if (skills["Turbo Charged"] && action.building === "Turbo Composter") {
      produceAmount += 5;
    }

    if (skills["Premium Worms"] && action.building === "Premium Composter") {
      produceAmount += 10;
    }

    if (skills["Composting Overhaul"] && produce === "Sprout Mix") {
      produceAmount -= 5;
    }

    if (skills["More With Less"]) {
      produceAmount -= 1;
    }

    // start the production
    buildings[0].producing = {
      items: {
        [composterDetails(stateCopy.bumpkin.skills)[action.building].produce]:
          produceAmount,
        // Set on backend
        [composterDetails(stateCopy.bumpkin.skills)[action.building].worm]: 1,
      },
      startedAt: createdAt,
      readyAt: createdAt + getReadyAt(stateCopy, action.building),
    };

    return stateCopy;
  });
}
