import { CONFIG } from "lib/config";
import FlowerOFTAbi from "./abis/FlowerOFT";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { NetworkOption } from "features/island/hud/components/deposit/DepositFlower";

export interface DepositArgs {
  account: `0x${string}`;
  depositAddress: `0x${string}`;
  amount: bigint;
  selectedNetwork: NetworkOption;
}

export async function depositFlower({
  account,
  depositAddress,
  amount,
  selectedNetwork,
}: DepositArgs) {
  const hash = await writeContract(config, {
    chainId: selectedNetwork.chainId as any,
    abi: FlowerOFTAbi,
    address: CONFIG.FLOWER_CONTRACT as `0x${string}`,
    functionName: "transfer",
    account,
    args: [depositAddress, amount],
  });

  await waitForTransactionReceipt(config, { hash });
}

export async function getFlowerBalance({
  account,
  selectedNetwork,
}: {
  account: `0x${string}`;
  selectedNetwork: NetworkOption;
}) {
  const balance = await readContract(config, {
    chainId: selectedNetwork.chainId as any,
    abi: FlowerOFTAbi,
    address: CONFIG.FLOWER_CONTRACT as `0x${string}`,
    functionName: "balanceOf",
    account,
    args: [account],
  });

  return balance;
}
