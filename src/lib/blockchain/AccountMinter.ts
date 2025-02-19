import { CONFIG } from "lib/config";
import { fromWei } from "web3-utils";
import ABI from "./abis/AccountMinter";
import { parseMetamaskError } from "./utils";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { polygon, polygonAmoy } from "@wagmi/core/chains";

export async function getCreatedAt(
  account: `0x${string}`,
  address: `0x${string}`,
  attempts = 1,
): Promise<number> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const createdAt = await readContract(config, {
      abi: ABI,
      address: CONFIG.ACCOUNT_MINTER_CONTRACT,
      functionName: "farmCreatedAt",
      args: [address],
      account,
    });

    return Number(createdAt);
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getCreatedAt(account, address, attempts + 1);
    }

    throw error;
  }
}

export async function createNewAccount({
  account,
  signature,
  deadline,
  fee,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  deadline: number;
  fee: string;
}) {
  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: ABI,
    address: CONFIG.ACCOUNT_MINTER_CONTRACT,
    functionName: "mintAccount",
    args: [signature, BigInt(deadline), BigInt(fee), account],
    value: BigInt(fee),
    account,
  });
  await waitForTransactionReceipt(config, { hash });

  onboardingAnalytics.logEvent("purchase", {
    currency: "MATIC",
    // Unique ID to prevent duplicate events
    transaction_id: `create-${account}`,
    value: Number(fromWei(fee)),
    items: [
      {
        item_id: "NFT_ACCOUNT",
        item_name: "NFT Account",
      },
    ],
  });
}
