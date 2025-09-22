import { parseMetamaskError } from "./utils";
import { CONFIG } from "lib/config";
import PetABI from "./abis/Pet";
import { config } from "features/wallet/WalletProvider";
import { readContract } from "@wagmi/core";
import { polygon, polygonAmoy } from "viem/chains";

const contractAddress = CONFIG.PET_CONTRACT;

export async function getPetsBalance(
  address: `0x${string}`,
  attempts = 0,
): Promise<number[]> {
  try {
    const pets = await readContract(config, {
      chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      abi: PetABI,
      address: contractAddress as `0x${string}`,
      functionName: "tokensOfOwner",
      args: [address],
    });

    return pets.map(Number).filter((n) => n <= 3000);
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getPetsBalance(address, attempts + 1);
    }

    throw error;
  }
}
