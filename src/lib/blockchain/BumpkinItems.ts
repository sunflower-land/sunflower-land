import Web3 from "web3";
import { AbiItem } from "web3-utils";
import BumpkinItemsJSON from "./abis/BumpkinItems.json";
import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";
import { BumpkinItems as IBumpkinItems } from "./types/BumpkinItems";
import { IDS } from "features/game/types/bumpkin";

const address = CONFIG.BUMPKIN_ITEMS_CONTRACT;

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

  try {
    const balance: string = await (
      new web3.eth.Contract(
        BumpkinItemsJSON as AbiItem[],
        address as string
      ) as unknown as IBumpkinItems
    ).methods
      .balanceOf(account, id)
      .call({ from: account });
    return Number(balance);
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return balanceOf(web3, account, id, attempts + 1);
    }

    throw error;
  }
}

export async function loadBalanceBatch(
  web3: Web3,
  account: string,
  attempts = 0
): Promise<Record<number, number>> {
  try {
    const balances = await (
      new web3.eth.Contract(
        BumpkinItemsJSON as AbiItem[],
        address as string
      ) as unknown as IBumpkinItems
    ).methods
      .balanceOfBatch(
        new Array(IDS.length).fill(account),
        IDS.map((id) => `${id}`)
      )
      .call({ from: account });

    return balances.reduce((amounts, itemBalance, index) => {
      if (Number(itemBalance) > 0) {
        amounts[IDS[index]] = Number(itemBalance);
      }

      return amounts;
    }, {} as Record<number, number>);
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return loadBalanceBatch(web3, account, attempts + 1);
    }

    throw error;
  }
}
