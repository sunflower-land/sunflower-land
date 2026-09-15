import type { GameState } from "features/game/types/game";
import { produce } from "immer";
import {
  chargeCoinsForSpeedUp,
  getInstantGems,
  makeGemHistory,
  type SpeedUpPaymentMethod,
} from "features/game/lib/getInstantGems";
import Decimal from "decimal.js-light";
import { mfCurrencyChange } from "lib/moonforgeAnalytics";
import { recalculateCraftingQueue } from "./cancelQueuedCrafting";
import { getCraftingBoostWindows } from "features/game/lib/boostWindows";
import { resolveCraftingQueue } from "features/game/lib/craftingReadiness";

export type InstantCraftAction = {
  type: "crafting.spedUp";
  paymentMethod?: SpeedUpPaymentMethod;
};

type Options = {
  state: Readonly<GameState>;
  action: InstantCraftAction;
  createdAt?: number;
  farmId?: number;
};

export function speedUpCrafting({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (action.type !== "crafting.spedUp") {
      throw new Error("Invalid action");
    }

    const { craftingBox, inventory } = game;
    const queue = craftingBox.queue ?? [];
    const { status } = craftingBox;

    if (status !== "crafting" || queue.length === 0) {
      throw new Error("Crafting box is not crafting");
    }

    // Readiness and the price both come from the DERIVED chain, not the stored
    // `readyAt` cache: a boost placed since the last write has already pulled the
    // queue forward, so the cache can name a craft that is in fact finished (the
    // player would pay gems for nothing) and would quote a wait longer than the
    // one they can actually see.
    const readyAts = resolveCraftingQueue({
      queue,
      windows: getCraftingBoostWindows(game),
    });

    // Address by INDEX, never by a readyAt predicate: two crafts can share a ready
    // time, and only the one paid for should be affected.
    const index = readyAts.findIndex((readyAt) => readyAt > createdAt);
    if (index === -1) {
      throw new Error("Crafting box is not ready to be sped up");
    }

    const gems = getInstantGems({
      readyAt: readyAts[index],
      now: createdAt,
      game,
    });

    const coinsBefore = game.coins;
    const gemsBefore = (game.inventory["Gem"] ?? new Decimal(0)).toNumber();

    if (action.paymentMethod === "coins") {
      game = chargeCoinsForSpeedUp({ game, gems, createdAt });
    } else {
      const inventoryGems = inventory["Gem"] ?? new Decimal(0);

      if (!inventoryGems.gte(gems)) {
        throw new Error("Insufficient gems");
      }

      inventory["Gem"] = inventoryGems.sub(gems);

      game = makeGemHistory({ game, amount: gems, createdAt });
    }

    // Recalculated in place. The queue is deliberately NOT re-ordered into
    // ready-then-in-progress any more: array position is the chain's only
    // structure once starts are derived, and reordering also scrambles the UI's
    // slot order.
    game.craftingBox.queue = recalculateCraftingQueue({
      queue,
      game,
      now: createdAt,
      spedUpIndex: index,
      spedUpAt: createdAt,
    });

    mfCurrencyChange("speed_up_crafting", "spend", {
      coin: { before: coinsBefore, after: game.coins },
      gem: {
        before: gemsBefore,
        after: (game.inventory["Gem"] ?? new Decimal(0)).toNumber(),
      },
    });

    return game;
  });
}
