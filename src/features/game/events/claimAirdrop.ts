import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { getKeys } from "../types/craftables";
import { GameState } from "../types/game";

export type ClaimAirdropAction = {
  type: "airdrop.claimed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimAirdropAction;
};

export function claimAirdrop({ state, action }: Options): GameState {
  const game = cloneDeep(state);

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

  const wardrobe = getKeys(airdrop.wearables ?? {}).reduce((acc, itemName) => {
    const previous = acc[itemName] || 0;

    return {
      ...acc,
      [itemName]: previous + (airdrop.wearables[itemName] || 0),
    };
  }, game.wardrobe);

  return {
    ...game,
    balance: game.balance.add(airdrop.sfl),
    airdrops: game.airdrops.filter((item) => item.id !== action.id),
    inventory,
    wardrobe,
    coins: game.coins + (airdrop.coins ?? 0),
  };
}
