import Decimal from "decimal.js-light";
import { GameState } from "../../types/game";

import { produce } from "immer";
import {
  VIP_DURATIONS,
  VIP_PRICES,
  VipBundle,
} from "features/game/lib/vipAccess";

export type PurchaseVIPAction = {
  type: "vip.purchased";
  name: VipBundle;
};

type Options = {
  state: Readonly<GameState>;
  action: PurchaseVIPAction;
  createdAt?: number;
  farmId?: number;
};

export function purchaseVIP({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const bundlePrice = VIP_PRICES[action.name];

    if (!bundlePrice) {
      throw new Error("Invalid VIP bundle");
    }

    const gems = stateCopy.inventory.Gem ?? new Decimal(0);

    if (gems.lt(bundlePrice)) {
      throw new Error("Missing gems");
    }

    stateCopy.inventory.Gem = gems.sub(bundlePrice);

    const duration = VIP_DURATIONS[action.name];

    // Either add onto the current VIP expiration or the purchase time
    const from = Math.max(stateCopy.vip?.expiresAt ?? 0, createdAt);

    stateCopy.vip = {
      expiresAt: from + duration,
      bundles: [
        ...(stateCopy.vip?.bundles ?? []),
        { name: action.name, boughtAt: createdAt },
      ],
    };

    return stateCopy;
  });
}
