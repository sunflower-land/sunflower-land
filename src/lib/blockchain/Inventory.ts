import Decimal from "decimal.js-light";
import { KNOWN_IDS, IDS } from "features/game/types";
import { InventoryItemName } from "features/game/types/game";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import InventoryJSON from "./abis/Inventory.json";
import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";

const address = CONFIG.INVENTORY_CONTRACT;

export type ItemSupply = Record<InventoryItemName, Decimal>;

/**
 * Inventory contract
 */
export class Inventory {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      InventoryJSON as AbiItem[],
      address as string
    );
  }

  private async loadSupplyBatch(
    ids: number[],
    attempts = 0
  ): Promise<number[]> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const supplies: number[] = await this.contract.methods
        .totalSupplyBatch(ids)
        .call({ from: this.account });

      return supplies;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.loadSupplyBatch(ids, attempts + 1);
      }

      throw error;
    }
  }

  public async totalSupply() {
    const ids = Object.values(KNOWN_IDS);
    const names = Object.keys(KNOWN_IDS) as InventoryItemName[];

    const supplies: number[] = await this.loadSupplyBatch(ids);

    return supplies.reduce(
      (items, supply, index) => ({
        ...items,
        [names[index]]: new Decimal(supply),
      }),
      {} as ItemSupply
    );
  }

  public async getBalances(farmAddress: string) {
    const batchAccounts = Array(IDS.length).fill(farmAddress);
    const balances = await this.contract.methods
      .balanceOfBatch(batchAccounts, IDS)
      .call();

    return balances;
  }
}
