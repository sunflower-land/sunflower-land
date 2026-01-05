import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { getRemainingReels } from "./castRod";

export type BuyMoreReelsAction = {
  type: "fishing.reelsBought";
  packs: number;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMoreReelsAction;
  createdAt?: number;
};

export const EXTRA_REELS_AMOUNT = 5;

export function buyMoreReels({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    const today = new Date(createdAt).toISOString().split("T")[0];
    const gems = game.inventory["Gem"] ?? new Decimal(0);
    const gemPrice = getReelsPackGemPrice({
      state: game,
      packs: action.packs,
      createdAt,
    });

    if (getRemainingReels(game) > 0) {
      throw new Error("Player has reels remaining");
    }

    if (gems.lt(gemPrice)) {
      throw new Error("Player does not have enough Gems to buy more reels");
    }

    game.inventory["Gem"] = gems.sub(gemPrice);

    const { extraReels = { count: 0 } } = game.fishing;

    if (extraReels.timesBought && extraReels.timesBought[today]) {
      extraReels.timesBought[today] += 1;
    } else {
      extraReels.timesBought = {
        [today]: 1,
      };
    }

    extraReels.count += EXTRA_REELS_AMOUNT;

    return game;
  });
}

export function getReelsPackGemPrice({
  state,
  packs,
  createdAt = Date.now(),
}: {
  state: GameState;
  packs: number; // number of 5-reel packs
  createdAt?: number;
}): number {
  const today = new Date(createdAt).toISOString().split("T")[0];

  const { extraReels = { count: 0 } } = state.fishing;
  const { timesBought = {} } = extraReels;

  const basePrice = 10;
  const gemMultiplier = 2;

  const timesBoughtToday = timesBought[today] ?? 0;

  // Price for ONE pack at the current scale
  const singlePackPrice = basePrice * gemMultiplier ** timesBoughtToday;

  // Total price for N packs
  return singlePackPrice * packs;
}
