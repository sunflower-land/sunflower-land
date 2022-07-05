import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import TraderJSON from "./abis/Trader.json";

const address = CONFIG.TRADER_CONTRACT;

export type Listing = {
  id: number;
};

export type FarmSlot = {
  slotId: number;
  listing?: Listing;
};
/**
 * Trader contract
 */
export class Trader {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      TraderJSON as AbiItem[],
      address as string
    );
  }

  public async getFarmSlots(farmId: number): Promise<FarmSlot[]> {
    const farmSlots: { status: string; listingId: string }[] =
      await this.contract.methods.getFarmSlots(farmId, 3).call();

    console.log(farmSlots);

    return farmSlots.map((slot, index) => {
      if (slot.status == "0") {
        return { slotId: index };
      }
      return { slotId: index, listing: { id: Number(slot.listingId) } };
    });
  }
}
