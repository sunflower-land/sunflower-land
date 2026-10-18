import Decimal from "decimal.js-light";
import { produce } from "immer";

import type { GameState } from "features/game/types/game";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { CONFIG } from "lib/config";

/**
 * Internal airdrop tooling.
 *
 * This helps us test collectibles and wearables for players before a wider
 * release - it drops a bundle of FLOWER onto the account so we can eyeball how
 * the reward flow renders in the wallet before the items follow.
 *
 * Restricted to the team's admin farms and gated behind an active VIP pass.
 */

// Farm IDs allowed to run the internal airdrop tooling.
// This is Adam's farm.
const ADMIN_IDS = [1];

export type AirdropFlowerAction = {
  type: "flower.airdropped";
  // Amount of FLOWER to drop onto the account for this QA pass.
  flower: number;
};

type Options = {
  state: Readonly<GameState>;
  action: AirdropFlowerAction;
  farmId: number;
  createdAt?: number;
};

export function airdropFlower({
  state,
  action,
  farmId,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    // Internal tooling is only wired up against the production network - it is
    // never run on testnet.
    if (CONFIG.NETWORK !== "mainnet") {
      throw new Error("Airdrop tooling is only available on production");
    }

    const { bumpkin } = game;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin");
    }

    // Restrict the tooling to the team's admin farms.
    const isAdmin = ADMIN_IDS.some((id) => `${farmId}`.includes(`${id}`));
    if (!isAdmin) {
      throw new Error("Only team members can use the airdrop tool");
    }

    // Tooling is VIP-only so it can never be triggered by a free account.
    if (!hasVipAccess({ game, now: createdAt, type: "full" })) {
      throw new Error("VIP is required");
    }

    const flower = new Decimal(action.flower);
    if (flower.lessThanOrEqualTo(0)) {
      throw new Error("Invalid amount");
    }

    // Drop the FLOWER bundle onto the account.
    game.balance = game.balance.add(flower);

    return game;
  });
}
