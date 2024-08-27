import { CONFIG } from "lib/config";
import { AbiItem } from "web3-utils";
import FarmABI from "./abis/Farm";
import { parseMetamaskError } from "./utils";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";

const address = CONFIG.FARM_CONTRACT;

type FarmAccount = {
  account: string;
  owner: string;
  tokenId: string;
};

export async function getFarms(
  account: `0x${string}`,
  attempts = 0,
): Promise<FarmAccount[]> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    return await readContract(config, {
      abi: FarmABI,
      address,
      functionName: "getFarms",
      args: [account],
      account,
    });
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getFarms(account, attempts + 1);
    }

    throw error;
  }
}

export async function getFarm(tokenId: number): Promise<FarmAccount> {
  const farm = await new web3.eth.Contract(
    FarmABI as AbiItem[],
    address as string,
  ).methods
    .getFarm(tokenId)
    .call();

  return farm;
}

export async function transfer({
  account,
  to,
  tokenId,
}: {
  account: `0x${string}`;
  to: `0x${string}`;
  tokenId: number;
}) {
  await writeContract(config, {
    abi: FarmABI,
    address,
    functionName: "transferFrom",
    args: [account, to, BigInt(tokenId)],
    account,
  });
}
