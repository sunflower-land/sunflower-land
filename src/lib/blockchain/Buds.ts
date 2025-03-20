import { parseMetamaskError } from "./utils";
import { CONFIG } from "lib/config";
import BudABI from "./abis/Buds";
import { config } from "features/wallet/WalletProvider";
import { readContract } from "@wagmi/core";
import { polygon, polygonAmoy } from "viem/chains";

const contractAddress = CONFIG.BUD_CONTRACT;

export async function getBudsBalance(
  address: `0x${string}`,
  attempts = 0,
): Promise<number[]> {
  try {
    const buds = await readContract(config, {
      chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      abi: BudABI,
      address: contractAddress as `0x${string}`,
      functionName: "tokensOfOwner",
      args: [address],
    });

    return buds.map(Number).filter((n) => n <= 5000);
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getBudsBalance(address, attempts + 1);
    }

    throw error;
  }
}
