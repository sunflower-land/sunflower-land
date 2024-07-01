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
import cloneDeep from "lodash.clonedeep";
import { translate } from "lib/i18n/translate";

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
  const timeToFinish = composterDetails[composter].timeToFinishMilliseconds;

  // gives +10% speed boost if the player has the Soil Krabby
  if (isCollectibleBuilt({ name: "Soil Krabby", game: gameState })) {
    return timeToFinish * 0.9;
  }
  return timeToFinish;
};

export function startComposter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);

  const buildings = stateCopy.buildings[action.building] as CompostBuilding[];
  if (!buildings) {
    throw new Error(translate("error.composterNotExist"));
  }

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
      ("Missing requirements");
    }

    stateCopy.inventory[name as InventoryItemName] = previous.minus(
      composter.requires?.[name] ?? 0,
    );
  });

  // start the production
  buildings[0].producing = {
    items: {
      [composterDetails[action.building].produce]: 10,
      // Set on backend
      [composterDetails[action.building].worm]: 1,
    },
    startedAt: createdAt,
    readyAt: createdAt + getReadyAt(stateCopy, action.building),
  };

  return stateCopy;
}
