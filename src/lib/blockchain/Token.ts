import { CONFIG } from "lib/config";
import TokenJSON from "./abis/Token";
import { parseMetamaskError } from "./utils";
import { readContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { polygon, polygonAmoy } from "viem/chains";

/**
 * Keep full wei amount as used for approving/sending
 */
export async function sflBalanceOf(
  address: `0x${string}`,
  attempts = 0,
): Promise<bigint> {
  try {
    return await readContract(config, {
      chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      abi: TokenJSON,
      address: CONFIG.TOKEN_CONTRACT,
      functionName: "balanceOf",
      args: [address],
      account: address,
    });
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return await sflBalanceOf(address, attempts + 1);
    }

    throw error;
  }
}
