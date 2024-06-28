import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type ClaimFactionPrizeAction = {
  type: "faction.prizeClaimed";
  week: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimFactionPrizeAction;
  createdAt?: number;
};

export function claimFactionPrize({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const game: GameState = cloneDeep(state);

  const week = game.faction?.history?.[action.week];
  if (!week?.results?.reward) {
    throw new Error(`Prize not found for week ${action.week}`);
  }

  if (week.results.claimedAt) {
    throw new Error(`Prize already claimed`);
  }

  const reward = week.results.reward;

  game.balance = game.balance.add(reward.sfl);
  game.coins = game.coins + reward.coins;

  getKeys(reward.items).forEach((name) => {
    const previous = game.inventory[name] ?? new Decimal(0);
    game.inventory[name] = previous.add(reward.items[name] ?? 0);
  });

  week.results.claimedAt = createdAt;

  return game;
}
