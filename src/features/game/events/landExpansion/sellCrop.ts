import Decimal from "decimal.js-light";
import { Crop, CropName, CROPS, GREENHOUSE_CROPS } from "../../types/crops";
import { GameState } from "../../types/game";
import cloneDeep from "lodash.clonedeep";
import { getSellPrice } from "features/game/expansion/lib/boosts";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { setPrecision } from "lib/utils/formatNumber";
import {
  Fruit,
  FRUIT,
  FruitName,
  GREENHOUSE_FRUIT,
} from "features/game/types/fruits";

export type SellableName = CropName | FruitName;
export type SellableItem = Crop | Fruit;

export type SellCropAction = {
  type: "crop.sold";
  crop: SellableName;
  amount: number;
};

export const SELLABLE = {
  ...CROPS(),
  ...FRUIT(),
  ...GREENHOUSE_CROPS(),
  ...GREENHOUSE_FRUIT(),
};

type Options = {
  state: GameState;
  action: SellCropAction;
};

export function sellCrop({ state, action }: Options): GameState {
  const game = cloneDeep(state);

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
  });

  const coinsEarned = price * action.amount;
  bumpkin.activity = trackActivity(
    "Coins Earned",
    bumpkin.activity,
    new Decimal(coinsEarned)
  );
  bumpkin.activity = trackActivity(
    `${action.crop} Sold`,
    bumpkin?.activity,
    new Decimal(amount)
  );

  game.coins = game.coins + coinsEarned;
  game.inventory[action.crop] = setPrecision(count.sub(amount));

  return game;
}
