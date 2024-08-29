import { CONFIG } from "lib/config";
import { fromWei } from "web3-utils";
import BuyBlockBucksAbi from "./abis/BuyBlockBucks";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";

const address = CONFIG.BUY_BLOCK_BUCKS_CONTRACT;

interface BuyBlockBucksArgs {
  account: `0x${string}`;
  signature: `0x${string}`;
  farmId: number;
  amount: number;
  deadline: number;
  fee: number;
}

export async function buyBlockBucksMATIC({
  account,
  signature,
  farmId,
  amount,
  deadline,
  fee,
}: BuyBlockBucksArgs) {
  const hash = await writeContract(config, {
    abi: BuyBlockBucksAbi,
    address: address as `0x${string}`,
    functionName: "buyBlockBucksMATIC",
    args: [
      signature,
      BigInt(farmId),
      BigInt(amount),
      BigInt(fee),
      BigInt(deadline),
    ],
    value: BigInt(fee),
    account,
  });
  await waitForTransactionReceipt(config, { hash });

  onboardingAnalytics.logEvent("purchase", {
    currency: "MATIC",
    // Unique ID to prevent duplicate events
    transaction_id: `${Date.now()}-${farmId}`,
    value: Number(fromWei(fee.toString())),
    items: [
      {
        item_id: "Block_Buck",
        item_name: "Block Buck",
        quantity: amount,
      },
    ],
  });
}
