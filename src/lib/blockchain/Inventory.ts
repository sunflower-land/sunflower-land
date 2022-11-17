import Decimal from "decimal.js-light";
import { KNOWN_IDS, IDS } from "features/game/types";
import { InventoryItemName } from "features/game/types/game";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import InventoryJSON from "./abis/Inventory.json";
import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";
import { SunflowerLandInventory } from "./types";
import { TransferBatch, TransferSingle } from "./types/SunflowerLandInventory";

const address = CONFIG.INVENTORY_CONTRACT;

export type ItemSupply = Record<InventoryItemName, Decimal>;

/**
 * Inventory contract
 */
export class Inventory {
  private web3: Web3;
  private account: string;

  private contract: SunflowerLandInventory;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      InventoryJSON as AbiItem[],
      address as string
    ) as unknown as SunflowerLandInventory;
  }

  private async loadSupplyBatch(
    ids: number[],
    attempts = 0
  ): Promise<string[]> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const supplies: string[] = await this.contract.methods
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

    const supplies: string[] = await this.loadSupplyBatch(ids);

    return supplies.reduce(
      (items, supply, index) => ({
        ...items,
        [names[index]]: new Decimal(supply),
      }),
      {} as ItemSupply
    );
  }

  public async getSupply(ids: number[]) {
    const supply = await this.loadSupplyBatch(ids);
    return supply.map(Number);
  }

  public async getBalances(farmAddress: string) {
    const batchAccounts = Array(IDS.length).fill(farmAddress);
    const balances = await this.contract.methods
      .balanceOfBatch(batchAccounts, IDS)
      .call();

    return balances;
  }

  public async getBalance(farmAddress: string, id: number): Promise<string> {
    return await this.contract.methods.balanceOf(farmAddress, id).call();
  }

  public async getTransfers(farmAddress: string, fromBlock: number) {
    const events: TransferSingle[] = await new Promise((res, rej) => {
      this.contract.getPastEvents(
        "TransferSingle",
        {
          filter: {
            to: farmAddress,
          },
          fromBlock,
          toBlock: "latest",
        },
        function (error, events) {
          if (error) {
            rej(error);
          }

          res(events as unknown as TransferSingle[]);
        }
      );
    });

    const externalEvents = events.filter(
      (event) =>
        event.returnValues.from !== "0x0000000000000000000000000000000000000000"
    );

    return externalEvents;
  }

  public async getBatchTransfers(farmAddress: string, fromBlock: number) {
    const events: TransferBatch[] = await new Promise((res, rej) => {
      this.contract.getPastEvents(
        "TransferBatch",
        {
          filter: {
            to: farmAddress,
          },
          fromBlock,
          toBlock: "latest",
        },
        function (error, events) {
          if (error) {
            rej(error);
          }

          res(events as unknown as TransferBatch[]);
        }
      );
    });

    const externalEvents = events.filter(
      (event) =>
        event.returnValues.from !== "0x0000000000000000000000000000000000000000"
    );

    return externalEvents;
  }
}
