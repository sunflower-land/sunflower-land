import Decimal from "decimal.js-light";
import { getKeys } from "lib/object";
import type { GameState } from "features/game/types/game";
import { produce } from "immer";
import { mfCurrencyChange } from "lib/moonforgeAnalytics";

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
  return produce(state, (game) => {
    const week = game.faction?.history?.[action.week];
    if (!week?.results?.reward) {
      throw new Error(`Prize not found for week ${action.week}`);
    }

    if (week.results.claimedAt) {
      throw new Error(`Prize already claimed`);
    }

    const reward = week.results.reward;
    const coinsBefore = game.coins;
    const sflBefore = game.balance.toNumber();

    game.balance = game.balance.add(reward.sfl);
    game.coins = game.coins + reward.coins;

    getKeys(reward.items).forEach((name) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(reward.items[name] ?? 0);
    });

    week.results.claimedAt = createdAt;

    mfCurrencyChange("faction_prize", "grant", {
      coin: { before: coinsBefore, after: game.coins },
      sfl: { before: sflBefore, after: game.balance.toNumber() },
    });

    return game;
  });
}
