import { CONFIG } from "lib/config";
import SessionABI from "./abis/SunflowerLandSessionManager";
import { parseMetamaskError } from "./utils";
import { readContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { polygon, polygonAmoy } from "viem/chains";

const address = CONFIG.SESSION_CONTRACT;

export async function getSessionId(
  farmId: number,
  attempts = 0,
): Promise<string> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    return await readContract(config, {
      chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      abi: SessionABI,
      address,
      functionName: "getSessionId",
      args: [BigInt(farmId)],
    });
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getSessionId(farmId, attempts + 1);
    }

    throw error;
  }
}

/**
 * Poll until data is ready
 */
export async function getNextSessionId(
  account: string,
  farmId: number,
  oldSessionId: string,
): Promise<string> {
  await new Promise((res) => setTimeout(res, 3000));

  const sessionId = await getSessionId(farmId);

  // Try again
  if (sessionId === oldSessionId) {
    return getNextSessionId(account, farmId, oldSessionId);
  }

  return sessionId;
}
