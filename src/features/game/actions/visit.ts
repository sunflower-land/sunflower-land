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
  farmAddress: string;
  id: number;
};

export async function isFarmBlacklisted(id: number) {
  const metadata = await loadMetadata(id);
  console.log({ metadata });
  return metadata.image.includes("blacklisted");
}

export async function getOnChainState({
  farmAddress,
  id,
}: GetStateArgs): Promise<{ game: GameState; owner: string }> {
  if (!CONFIG.API_URL) {
    return { game: EMPTY, owner: "" };
  }

  const balance = await metamask.getToken().balanceOf(farmAddress);
  const balances = await metamask.getInventory().getBalances(farmAddress);
  const farm = await metamask.getFarm().getFarm(id);
  const inventory = balancesToInventory(balances);
  const fields = populateFields(inventory);

  return {
    game: {
      ...EMPTY,
      balance: new Decimal(fromWei(balance)),
      farmAddress,
      fields,
      inventory,
    },
    owner: farm.owner,
  };
}
