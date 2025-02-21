import BumpkinItemsJSON from "./abis/BumpkinItems";
import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";
import { IDS, ITEM_NAMES } from "features/game/types/bumpkin";
import { Wardrobe } from "features/game/types/game";
import { readContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { polygon, polygonAmoy } from "viem/chains";

const address = CONFIG.BUMPKIN_ITEMS_CONTRACT;

export async function loadWardrobe(
  account: `0x${string}`,
  attempts = 0,
): Promise<Wardrobe> {
  try {
    const balances = await readContract(config, {
      chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      abi: BumpkinItemsJSON,
      address: address as `0x${string}`,
      functionName: "balanceOfBatch",
      args: [new Array(IDS.length).fill(account), IDS.map(BigInt)],
      account,
    });

    return (balances as any).reduce(
      (amounts: any, itemBalance: any, index: any) => {
        if (Number(itemBalance) > 0) {
          const id = IDS[index];
          const name = ITEM_NAMES[id];
          amounts[name] = Number(itemBalance);
        }

        return amounts;
      },
      {} as Wardrobe,
    );
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return loadWardrobe(account, attempts + 1);
    }

    throw error;
  }
}

export async function loadWearablesBalanceBatch(
  account: `0x${string}`,
  attempts = 0,
): Promise<Record<number, number>> {
  try {
    const balances = await readContract(config, {
      chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      abi: BumpkinItemsJSON,
      address: address as `0x${string}`,
      functionName: "balanceOfBatch",
      args: [new Array(IDS.length).fill(account), IDS.map(BigInt)],
      account,
    });

    return (balances as any).reduce(
      (amounts: any, itemBalance: any, index: any) => {
        if (Number(itemBalance) > 0) {
          amounts[IDS[index]] = Number(itemBalance);
        }

        return amounts;
      },
      {} as Record<number, number>,
    );
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return loadWearablesBalanceBatch(account, attempts + 1);
    }

    throw error;
  }
}
