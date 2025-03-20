import { CONFIG } from "lib/config";
import BuySFLAbi from "./abis/BuySFL";
import { config } from "features/wallet/WalletProvider";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { polygon } from "viem/chains";
import { polygonAmoy } from "viem/chains";

const address = CONFIG.BUY_SFL_CONTRACT;

interface BuySFLArgs {
  account: `0x${string}`;
  signature: `0x${string}`;
  farmId: number;
  amountOutMin: number;
  deadline: number;
  feePercent: number;
  matic: number;
}

export async function buySFL({
  account,
  signature,
  farmId,
  amountOutMin,
  deadline,
  feePercent,
  matic,
}: BuySFLArgs) {
  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: BuySFLAbi,
    address: address as `0x${string}`,
    functionName: "swap",
    args: [
      signature,
      BigInt(farmId),
      BigInt(amountOutMin),
      BigInt(deadline),
      BigInt(feePercent),
    ],
    value: BigInt(matic),
    account,
  });
  await waitForTransactionReceipt(config, { hash });
}
