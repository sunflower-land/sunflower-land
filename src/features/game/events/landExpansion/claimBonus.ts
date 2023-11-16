import Decimal from "decimal.js-light";
import { BONUSES } from "features/game/types/bonuses";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

type Bonus = "discord-signup";

export type ClaimBonusAction = {
  type: "bonus.claimed";
  name: Bonus;
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

  if (bonus.isClaimed(game)) {
    throw new Error("Already claimed");
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
    game.wardrobe
  );

  return {
    ...game,
    inventory,
    wardrobe,
  };
}
