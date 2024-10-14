import { CONFIG } from "lib/config";
import PairJSON from "./abis/Pair";
import { readContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";

const address = CONFIG.PAIR_CONTRACT;

export async function getPairBalance(account: `0x${string}`) {
  return await readContract(config, {
    abi: PairJSON,
    address,
    functionName: "balanceOf",
    args: [account],
    account,
  });
}
