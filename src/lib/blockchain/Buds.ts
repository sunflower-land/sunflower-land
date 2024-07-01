import { AbiItem } from "web3-utils";
import { Buds } from "./types/Buds";
import { parseMetamaskError } from "./utils";
import { CONFIG } from "lib/config";
import BudABI from "./abis/Buds.json";

import Web3 from "web3";

const contractAddress = CONFIG.BUD_CONTRACT;

export async function getBudsBalance(
  web3: Web3,
  address: string,
  attempts = 0,
): Promise<number[]> {
  try {
    const buds = await (
      new web3.eth.Contract(
        BudABI as AbiItem[],
        contractAddress as string,
      ) as unknown as Buds
    ).methods
      .tokensOfOwner(address)
      .call();

    return buds.map(Number).filter((n) => n <= 5000);
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getBudsBalance(web3, address, attempts + 1);
    }

    throw error;
  }
}
