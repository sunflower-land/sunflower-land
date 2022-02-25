import { metamask } from "lib/blockchain/metamask";
import { fromWei } from "web3-utils";
import Decimal from "decimal.js-light";

import { balancesToInventory, populateFields } from "lib/utils/visitUtils";

import { GameState } from "../types/game";
import { EMPTY } from "../lib/constants";

export async function getVisitState(farmAddress: string): Promise<GameState> {
  const balance = await metamask.getToken().balanceOf(farmAddress);
  const balances = await metamask.getInventory().getBalances(farmAddress);
  const inventory = balancesToInventory(balances);
  const fields = populateFields(inventory);

  return {
    ...EMPTY,
    balance: new Decimal(fromWei(balance)),
    farmAddress,
    fields,
    inventory,
  };
}
