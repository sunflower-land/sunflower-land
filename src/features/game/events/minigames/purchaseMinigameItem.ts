import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { PLOT_CROPS, PlotCropName } from "features/game/types/crops";
import { PATCH_FRUIT, PatchFruitName } from "features/game/types/fruits";
import { GameState } from "features/game/types/game";
import {
  MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";
import { COMMODITIES, CommodityName } from "features/game/types/resources";
import { produce } from "immer";

export type MinigameCurrency = PlotCropName | PatchFruitName | CommodityName;

const SFL_LIMIT = 100;

export const MINIGAME_CURRENCY_LIMITS: Record<MinigameCurrency, number> = {
  ...getKeys(COMMODITIES).reduce(
    (acc, name) => ({ ...acc, [name]: 1000 }),
    {} as Record<PatchFruitName, number>,
  ),
  ...getKeys(PATCH_FRUIT()).reduce(
    (acc, name) => ({ ...acc, [name]: 1000 }),
    {} as Record<CommodityName, number>,
  ),
  ...getKeys(PLOT_CROPS).reduce(
    (acc, name) => ({ ...acc, [name]: 1000 }),
    {} as Record<PlotCropName, number>,
  ),
};

export type PurchaseMinigameAction = {
  type: "minigame.itemPurchased";
  id: MinigameName;
  sfl: number;
  items: Partial<Record<MinigameCurrency, number>>;
};

type Options = {
  state: Readonly<GameState>;
  action: PurchaseMinigameAction;
  createdAt?: number;
};

export function purchaseMinigameItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!SUPPORTED_MINIGAMES.includes(action.id)) {
      throw new Error(`${action.id} is not a valid minigame`);
    }

    if (game.balance.lt(action.sfl)) {
      throw new Error("Insufficient SFL");
    }

    if (action.sfl < 0) {
      throw new Error("SFL must be positive");
    }

    if (action.sfl > SFL_LIMIT) {
      throw new Error("SFL is greater than purchase limit");
    }

    game.inventory = getKeys(action.items ?? {}).reduce((inventory, name) => {
      const count = inventory[name] || new Decimal(0);
      const totalAmount = action.items[name] ?? 0;

      if (totalAmount > (MINIGAME_CURRENCY_LIMITS[name] ?? 0)) {
        throw new Error(`Purchase limit exceeded: ${name}`);
      }

      if (count.lessThan(totalAmount)) {
        throw new Error(`Insufficient resource: ${name}`);
      }

      if (totalAmount < 0) {
        throw new Error(`Cannot spend negative amount: ${name}`);
      }

      return {
        ...inventory,
        [name]: count.sub(totalAmount),
      };
    }, game.inventory);

    const minigames = (game.minigames ??
      {}) as Required<GameState>["minigames"];
    const minigame = minigames.games[action.id] ?? {
      history: {},
      purchases: [],
      highscore: 0,
    };

    const purchases = minigame.purchases ?? [];

    minigames.games[action.id] = {
      ...minigame,
      purchases: [
        ...purchases,
        {
          purchasedAt: createdAt,
          sfl: action.sfl,
          items: action.items,
        },
      ],
    };

    // Burn the SFL
    game.balance = game.balance.sub(action.sfl);

    return game;
  });
}
