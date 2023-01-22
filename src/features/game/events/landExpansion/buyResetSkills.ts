import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";

export type ResetSkillAction = {
  type: "reset.skill";
  sfl: Decimal;
};

export const ResetItem = {
  name: "Reset Item",
  sfl: new Decimal(100),
};

type Options = {
  state: Readonly<GameState>;
  action: ResetSkillAction;
};

export function buyResetSkill({ state }: Options) {
  const stateCopy = cloneDeep(state);

  const totalExpenses = ResetItem.sfl;

  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("Bumpkin not found");
  }

  bumpkin.activity = trackActivity(
    "SFL Spent",
    bumpkin?.activity,
    totalExpenses ?? new Decimal(0)
  );

  if (stateCopy.balance.lessThan(totalExpenses)) {
    throw new Error("Insufficient tokens");
  }

  return {
    ...stateCopy,
    balance: totalExpenses
      ? stateCopy.balance.sub(totalExpenses)
      : stateCopy.balance,
  };
}
