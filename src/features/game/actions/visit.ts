import { metamask } from "lib/blockchain/metamask";
import { fromWei } from "web3-utils";
import Decimal from "decimal.js-light";

import { balancesToInventory, populateFields } from "lib/utils/visitUtils";

import { GameState } from "../types/game";
import { EMPTY } from "../lib/constants";
import { CONFIG } from "lib/config";

const API_URL = CONFIG.API_URL;

async function loadMetadata(id: number) {
  // Go and fetch the metadata file for this farm
  const url = `${API_URL}/nfts/farm/${id}`;
  const response = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });

  const data = await response.json();

  return data;
}
type GetStateArgs = {
  id: number;
  farmAddress: string;
};
export async function getOnChainState({
  id,
  farmAddress,
}: GetStateArgs): Promise<{ game: GameState; isBlacklisted: boolean }> {
  const balance = await metamask.getToken().balanceOf(farmAddress);
  const balances = await metamask.getInventory().getBalances(farmAddress);
  const inventory = balancesToInventory(balances);
  const fields = populateFields(inventory);

  const metadata = await loadMetadata(id);
  const isBlacklisted = metadata.image.includes("blacklisted");
  return {
    game: {
      ...EMPTY,
      balance: new Decimal(fromWei(balance)),
      farmAddress,
      fields,
      inventory,
    },
    isBlacklisted,
  };
}
