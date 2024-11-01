import Decimal from "decimal.js-light";
import {
  GREENHOUSE_CROPS,
  GreenHouseCrop,
  PLOT_CROPS,
  PlotCrop,
  PlotCropName,
} from "../../types/crops";
import { GameState } from "../../types/game";
import { getSellPrice } from "features/game/expansion/lib/boosts";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { setPrecision } from "lib/utils/formatNumber";
import {
  GREENHOUSE_FRUIT,
  GreenHouseFruit,
  PATCH_FRUIT,
  PatchFruit,
  PatchFruitName,
} from "features/game/types/fruits";
import { produce } from "immer";
import { ExoticCrop } from "features/game/types/beans";

export type SellableName = PlotCropName | PatchFruitName;
export type SellableItem =
  | PlotCrop
  | PatchFruit
  | ExoticCrop
  | GreenHouseFruit
  | GreenHouseCrop;

export type SellCropAction = {
  type: "crop.sold";
  crop: SellableName;
  amount: number;
};

export const SELLABLE = {
  ...PLOT_CROPS,
  ...PATCH_FRUIT(),
  ...GREENHOUSE_CROPS,
  ...GREENHOUSE_FRUIT(),
};

type Options = {
  state: GameState;
  action: SellCropAction;
  createdAt?: number;
};

export function sellCrop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { bumpkin } = game;

    if (bumpkin === undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    if (!(action.crop in SELLABLE)) {
      throw new Error("Not for sale");
    }

    const amount = new Decimal(action.amount);
    if (amount.lessThanOrEqualTo(0)) {
      throw new Error("Invalid amount");
    }

    const sellables = SELLABLE[action.crop];

    const count = game.inventory[action.crop] || new Decimal(0);

    if (count.lessThan(action.amount)) {
      throw new Error("Insufficient quantity to sell");
    }

    const price = getSellPrice({
      item: sellables,
      game,
      now: new Date(createdAt),
    });

    const coinsEarned = price * action.amount;
    bumpkin.activity = trackActivity(
      "Coins Earned",
      bumpkin.activity,
      new Decimal(coinsEarned),
    );
    bumpkin.activity = trackActivity(
      `${action.crop} Sold`,
      bumpkin?.activity,
      new Decimal(amount),
    );

    game.coins = game.coins + coinsEarned;
    game.inventory[action.crop] = setPrecision(count.sub(amount));

    return game;
  });
}
