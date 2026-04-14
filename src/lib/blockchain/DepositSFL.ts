import { CONFIG } from "lib/config";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { NetworkOption } from "features/island/hud/components/deposit/DepositFlower";
import SFLABI from "lib/blockchain/abis/Token";

const SFL_ADDRESS =
  CONFIG.NETWORK === "mainnet"
    ? "0xD1f9c58e33933a993A3891F8acFe05a68E1afC05"
    : "0x64C865248a4ba3E9993F0c948246C0cC17E50F8F";

export interface DepositArgs {
  account: `0x${string}`;
  depositAddress: `0x${string}`;
  amount: bigint;
  selectedNetwork: NetworkOption;
}

export async function depositSFL({
  account,
  depositAddress,
  amount,
  selectedNetwork,
}: DepositArgs) {
  const hash = await writeContract(config, {
    chainId: selectedNetwork.chainId as any,
    abi: SFLABI,
    address: SFL_ADDRESS as `0x${string}`,
    functionName: "transfer",
    account,
    args: [depositAddress, amount],
  });

  await waitForTransactionReceipt(config, { hash });
}

export async function getSFLBalance({
  account,
  selectedNetwork,
}: {
  account: `0x${string}`;
  selectedNetwork: NetworkOption;
}) {
  const balance = await readContract(config, {
    chainId: selectedNetwork.chainId as any,
    abi: SFLABI,
    address: SFL_ADDRESS,
    functionName: "balanceOf",
    args: [account],
  });

  return balance;
}
