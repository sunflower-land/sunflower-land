import { metamask } from "lib/blockchain/metamask";
import { fromWei } from "web3-utils";
import Decimal from "decimal.js-light";

import { GameState, FieldItem } from "../types/game";

export async function getVisitState(farmAddress: string): Promise<GameState> {
  const balance = await metamask.getToken().balanceOf(farmAddress);
  const fields = Array(22).fill({ name: "Sunflower", plantedAt: 0 });
  const inventory = await metamask.getInventory().getBalances(farmAddress);

  return {
    balance: new Decimal(fromWei(balance)),
    farmAddress,
    fields: Object.assign({}, fields) as Record<number, FieldItem>,
    inventory,
  } as GameState;
}
