import Decimal from "decimal.js-light";
import { BONUSES, BonusName } from "features/game/types/bonuses";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type ClaimBonusAction = {
  type: "bonus.claimed";
  name: BonusName;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimBonusAction;
  createdAt?: number;
};

export function claimBonus({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);

  const bonus = BONUSES[action.name];

  if (!bonus) {
    throw new Error("No bonus exists");
  }

  if (bonus.isClaimed(game)) {
    throw new Error("Bonus already claimed");
  }

  const inventory = getKeys(bonus.reward.inventory).reduce((acc, itemName) => {
    const previous = acc[itemName] || new Decimal(0);

    return {
      ...acc,
      [itemName]: previous.add(bonus.reward.inventory[itemName] || 0),
    };
  }, game.inventory);

  const wardrobe = getKeys(bonus.reward.wearables ?? {}).reduce(
    (acc, itemName) => {
      const previous = acc[itemName] || 0;

      return {
        ...acc,
        [itemName]: previous + (bonus.reward.wearables[itemName] || 0),
      };
    },
    game.wardrobe,
  );

  return {
    ...game,
    inventory,
    wardrobe,
  };
}
