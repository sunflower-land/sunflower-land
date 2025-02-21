import ABI from "./abis/SunflowerDailyRewards";
import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { polygonAmoy } from "viem/chains";
import { polygon } from "viem/chains";

export async function getDailyCode(
  account: `0x${string}`,
  attempts = 0,
): Promise<number> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const code = await readContract(config, {
      chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      abi: ABI,
      address: CONFIG.DAILY_REWARD_CONTRACT as `0x${string}`,
      functionName: "counts",
      args: [account],
      account,
    });

    return Number(code ?? "0");
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getDailyCode(account, attempts + 1);
    }

    throw error;
  }
}

export async function trackDailyReward({
  account,
  code,
}: {
  account: `0x${string}`;
  code: number;
}): Promise<void> {
  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: ABI,
    address: CONFIG.DAILY_REWARD_CONTRACT as `0x${string}`,
    functionName: "reward",
    args: [code],
    account,
  });
  await waitForTransactionReceipt(config, { hash });
}
