import Web3 from "web3";
import { AbiItem } from "web3-utils";
import BumpkinItemsJSON from "./abis/BumpkinItems.json";
import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";
import { BumpkinItems as IBumpkinItems } from "./types/BumpkinItems";

const address = CONFIG.INVENTORY_CONTRACT;

export async function loadSupplyBatch(
  web3: Web3,
  account: string,
  ids: number[],
  attempts = 0
): Promise<string[]> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const supplies: string[] = await (
      new web3.eth.Contract(
        BumpkinItemsJSON as AbiItem[],
        address as string
      ) as unknown as IBumpkinItems
    ).methods
      .totalSupplyBatch(ids)
      .call({ from: account });

    return supplies;
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return loadSupplyBatch(web3, account, ids, attempts + 1);
    }

    throw error;
  }
}

export async function balanceOf(
  web3: Web3,
  account: string,
  id: number,
  attempts = 0
): Promise<number> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  console.log({ account: account, id });
  try {
    const balance: string = await (
      new web3.eth.Contract(
        BumpkinItemsJSON as AbiItem[],
        address as string
      ) as unknown as IBumpkinItems
    ).methods
      .balanceOf(account, id)
      .call({ from: account });

    console.log({ balance });
    return Number(balance);
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return balanceOf(web3, account, id, attempts + 1);
    }

    throw error;
  }
}
