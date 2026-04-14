import ABI from "./abis/Dequipper";
import { CONFIG } from "lib/config";
import { config } from "features/wallet/WalletProvider";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { polygon } from "viem/chains";
import { polygonAmoy } from "viem/chains";

export async function dequipBumpkin({
  account,
  bumpkinId,
  ids,
  amounts,
}: {
  account: `0x${string}`;
  bumpkinId: number;
  ids: number[];
  amounts: number[];
}): Promise<void> {
  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: ABI,
    address: CONFIG.DEQUIPPER_CONTRACT as `0x${string}`,
    functionName: "dequip",
    args: [BigInt(bumpkinId), ids.map(BigInt), amounts.map(BigInt)],
    account,
  });
  await waitForTransactionReceipt(config, { hash });
}
