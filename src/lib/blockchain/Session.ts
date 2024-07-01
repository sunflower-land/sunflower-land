import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import SessionABI from "./abis/SunflowerLandSessionManager.json";
import { parseMetamaskError } from "./utils";

const address = CONFIG.SESSION_CONTRACT;

export async function getSessionId(
  web3: Web3,
  farmId: number,
  attempts = 0,
): Promise<string> {
  const contract = new web3.eth.Contract(
    SessionABI as AbiItem[],
    address as string,
  );

  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const sessionId = await contract.methods.getSessionId(farmId).call();

    return sessionId;
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getSessionId(web3, farmId, attempts + 1);
    }

    throw error;
  }
}

/**
 * Poll until data is ready
 */
export async function getNextSessionId(
  web3: Web3,
  account: string,
  farmId: number,
  oldSessionId: string,
): Promise<string> {
  await new Promise((res) => setTimeout(res, 3000));

  const sessionId = await getSessionId(web3, farmId);

  // Try again
  if (sessionId === oldSessionId) {
    return getNextSessionId(web3, account, farmId, oldSessionId);
  }

  return sessionId;
}
