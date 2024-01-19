import Decimal from "decimal.js-light";
import { CropName, CROPS } from "../../types/crops";
import { GameState } from "../../types/game";
import cloneDeep from "lodash.clonedeep";
import { getSellPrice } from "features/game/expansion/lib/boosts";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { setPrecision } from "lib/utils/formatNumber";
import { Cake } from "features/game/types/craftables";
import { FRUIT, FruitName } from "features/game/types/fruits";
import { translate } from "lib/i18n/translate";

export type SellCropAction = {
  type: "crop.sold";
  crop: CropName | FruitName;
  amount: number;
};

export type SellableName = CropName | Cake | FruitName;

export type SellableItem = {
  name: SellableName;
  sellPrice?: Decimal;
};

export const SELLABLE = { ...CROPS(), ...FRUIT() };

type Options = {
  state: GameState;
  action: SellCropAction;
};

export function sellCrop({ state, action }: Options): GameState {
  const game = cloneDeep(state);

  const { bumpkin } = game;

  if (bumpkin === undefined) {
    throw new Error(translate("harvestflower.noBumpkin"));
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
    item: sellables as SellableItem,
    game,
  });

  const sflEarned = price.mul(action.amount);
  bumpkin.activity = trackActivity("SFL Earned", bumpkin.activity, sflEarned);
  bumpkin.activity = trackActivity(
    `${action.crop} Sold`,
    bumpkin?.activity,
    new Decimal(amount)
  );

  return {
    ...game,
    bumpkin,
    balance: game.balance.add(sflEarned),
    inventory: {
      ...game.inventory,
      [sellables.name]: setPrecision(count.sub(amount)),
    },
  };
}
