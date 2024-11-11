import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { getRemainingReels } from "./castRod";

export type BuyMoreReelsAction = {
  type: "fishing.reelsBought";
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMoreReelsAction;
  createdAt?: number;
};

const EXTRA_REELS_AMOUNT = 5;

export function buyMoreReels({ state, createdAt = Date.now() }: Options) {
  return produce(state, (game) => {
    const now = new Date(createdAt);
    const today = new Date(now).toISOString().split("T")[0];
    const gems = game.inventory["Gem"] ?? new Decimal(0);

    if (gems.lt(10)) {
      throw new Error("Player does not have enough Gems to buy more reels");
    }

    if (getRemainingReels(game) > 0) {
      throw new Error("Player has reels remaining");
    }

    const gemPrice = getReelGemPrice({ state: game, createdAt });
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

export function getReelGemPrice({
  state,
  createdAt = Date.now(),
}: {
  state: GameState;
  createdAt?: number;
}): number {
  const now = new Date(createdAt);
  const today = new Date(now).toISOString().split("T")[0];
  const { extraReels = { count: 0 } } = state.fishing;
  const { timesBought = {} } = extraReels;
  const basePrice = 10;
  const gemMultiplier = 1; // can be changed depending on decided rate

  if (!timesBought[today]) {
    return basePrice;
  } else {
    return basePrice + timesBought[today] * gemMultiplier;
  }
}
