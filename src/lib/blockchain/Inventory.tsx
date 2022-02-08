import Decimal from "decimal.js-light";
import { KNOWN_IDS } from "features/game/types";
import {
  InventoryItemName,
  Inventory as IInventory,
} from "features/game/types/game";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import InventoryJSON from "./abis/Inventory.json";

const address = import.meta.env.VITE_INVENTORY_CONTRACT;

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

  public async totalSupply() {
    const ids = Object.values(KNOWN_IDS);
    const names = Object.keys(KNOWN_IDS) as InventoryItemName[];

    const supplies: number[] = await this.contract.methods
      .totalSupplyBatch(ids)
      .call({ from: this.account });

    console.log({ supplies });

    return supplies.reduce(
      (items, supply, index) => ({
        ...items,
        [names[index]]: new Decimal(supply),
      }),
      {} as IInventory
    );
  }
}
