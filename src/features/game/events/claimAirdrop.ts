import Decimal from "decimal.js-light";
import { getKeys } from "../types/craftables";
import { GameState } from "../types/game";

import { produce } from "immer";

export type ClaimAirdropAction = {
  type: "airdrop.claimed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimAirdropAction;
};

export function claimAirdrop({ state, action }: Options): GameState {
  return produce(state, (game) => {
    if (!game.airdrops || game.airdrops.length === 0) {
      throw new Error("No airdrops exist");
    }

    const airdrop = game.airdrops.find((item) => item.id === action.id);

    if (!airdrop) {
      throw new Error(`Airdrop #${action.id} does not exist`);
    }

    const inventory = getKeys(airdrop.items).reduce((acc, itemName) => {
      const previous = acc[itemName] || new Decimal(0);

      return {
        ...acc,
        [itemName]: previous.add(airdrop.items[itemName] || 0),
      };
    }, game.inventory);

    const wardrobe = getKeys(airdrop.wearables ?? {}).reduce(
      (acc, itemName) => {
        const previous = acc[itemName] || 0;

        return {
          ...acc,
          [itemName]: previous + (airdrop.wearables[itemName] || 0),
        };
      },
      game.wardrobe,
    );

    // Add VIP (don't set purchased bundle though)
    if (airdrop.vipDays) {
      game.vip = {
        ...game.vip,
        bundles: game.vip?.bundles ?? [],
        expiresAt:
          Math.min(game.vip?.expiresAt ?? Date.now()) +
          airdrop.vipDays * 24 * 60 * 60 * 1000,
      };
    }

    return {
      ...game,
      balance: game.balance.add(airdrop.sfl),
      airdrops: game.airdrops.filter((item) => item.id !== action.id),
      inventory,
      wardrobe,
      coins: game.coins + (airdrop.coins ?? 0),
    };
  });
}
