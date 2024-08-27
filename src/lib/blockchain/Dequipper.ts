import ABI from "./abis/Dequipper";
import { CONFIG } from "lib/config";
import { config } from "features/wallet/WalletProvider";
import { writeContract } from "@wagmi/core";

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
  await writeContract(config, {
    abi: ABI,
    address: CONFIG.DEQUIPPER_CONTRACT as `0x${string}`,
    functionName: "dequip",
    args: [BigInt(bumpkinId), ids.map(BigInt), amounts.map(BigInt)],
    account,
  });
}
