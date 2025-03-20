import Decimal from "decimal.js-light";
import { IDS } from "features/game/types";
import { InventoryItemName } from "features/game/types/game";
import InventoryJSON from "./abis/Inventory";
import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";
import { readContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { polygon, polygonAmoy } from "viem/chains";

const contractAddress = CONFIG.INVENTORY_CONTRACT;

export type ItemSupply = Record<InventoryItemName, Decimal>;

export async function getInventoryBalances(
  address: `0x${string}`,
  attempts = 0,
): Promise<string[]> {
  try {
    const batchAccounts = Array(IDS.length).fill(address);

    const balances = await readContract(config, {
      chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      abi: InventoryJSON,
      address: contractAddress,
      functionName: "balanceOfBatch",
      args: [batchAccounts, IDS.map(BigInt)],
    });

    return balances.map(String);
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getInventoryBalances(address, attempts + 1);
    }

    throw error;
  }
}
