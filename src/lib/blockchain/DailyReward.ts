import ABI from "./abis/SunflowerDailyRewards";
import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";
import {
  getAccount,
  readContract,
  switchChain,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { NetworkName } from "features/game/events/landExpansion/updateNetwork";
import {
  base,
  baseSepolia,
  Chain,
  polygon,
  polygonAmoy,
  ronin,
  saigon,
} from "@wagmi/core/chains";

const DAILY_REWARD_CONTRACTS: Record<NetworkName, `0x${string}`> = {
  Base: "0x8bc1bfb0d7d43c6ea2baa693b746b7ab7856faa7" as `0x${string}`,
  "Base Sepolia": "0xa3a557713167083bb789aEC9976676f1dF335b40" as `0x${string}`,
  Polygon: CONFIG.DAILY_REWARD_CONTRACT as `0x${string}`,
  "Polygon Amoy": CONFIG.DAILY_REWARD_CONTRACT as `0x${string}`,
  Ronin: CONFIG.RONIN_DAILY_REWARD_CONTRACT as `0x${string}`,
  "Ronin Saigon": CONFIG.RONIN_DAILY_REWARD_CONTRACT as `0x${string}`,
};

export const NETWORKS: Record<NetworkName, Chain> = {
  Base: base,
  "Base Sepolia": baseSepolia,
  Polygon: polygon,
  "Polygon Amoy": polygonAmoy,
  Ronin: ronin,
  "Ronin Saigon": saigon,
};

export async function getDailyCode(
  account: `0x${string}`,
  network: NetworkName,
  attempts = 0,
): Promise<number> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  // try switch network if needed
  const { chainId } = getAccount(config);

  if (NETWORKS[network].id !== chainId) {
    await switchChain(config, {
      chainId: NETWORKS[network].id as any,
    });
  }

  try {
    const code = await readContract(config, {
      chainId: NETWORKS[network].id as any,
      abi: ABI,
      address: DAILY_REWARD_CONTRACTS[network],
      functionName: "counts",
      args: [account],
    });

    return Number(code);
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getDailyCode(account, network, attempts + 1);
    }

    throw error;
  }
}

export async function trackDailyReward({
  account,
  network,
  code,
}: {
  account: `0x${string}`;
  network: NetworkName;
  code: number;
}): Promise<void> {
  // try switch network if needed
  const { chainId } = getAccount(config);

  if (NETWORKS[network].id !== chainId) {
    await switchChain(config, {
      chainId: NETWORKS[network].id as any,
    });
  }

  const hash = await writeContract(config, {
    chainId: NETWORKS[network].id as any,
    abi: ABI,
    address: DAILY_REWARD_CONTRACTS[network],
    functionName: "reward",
    args: [code],
    account,
  });
  await waitForTransactionReceipt(config, { hash });

  await waitForTransactionReceipt(config, { hash });
}
