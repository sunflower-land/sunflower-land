import { CONFIG } from "lib/config";
import PairJSON from "./abis/Pair";
import { readContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { polygon, polygonAmoy } from "viem/chains";

const address = CONFIG.PAIR_CONTRACT;

export async function getPairBalance(account: `0x${string}`) {
  return await readContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: PairJSON,
    address,
    functionName: "balanceOf",
    args: [account],
    account,
  });
}
