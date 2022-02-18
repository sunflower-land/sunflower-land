import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import FarmABI from "./abis/Farm.json";

const address = CONFIG.FARM_CONTRACT;

type FarmAccount = {
  account: string;
  owner: string;
  tokenId: number;
};

type FarmCreatedEvent = {
  owner: string;
  landAddress: string;
  tokenId: number;
};
/**
 * Farm NFT contract
 */
export class Farm {
  private web3: Web3;
  private account: string;

  private farm: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.farm = new this.web3.eth.Contract(
      FarmABI as AbiItem[],
      address as string
    );
  }

  // TODO - simplify the smart contract to fetch this in 1 call
  public async getFarms(): Promise<FarmAccount[]> {
    const accounts = await this.farm.methods
      .getFarms(this.account)
      .call({ from: this.account });

    return accounts;
  }

  public async getFarm(tokenId: number): Promise<FarmAccount> {
    const account = await this.farm.methods.getFarm(tokenId).call();

    return account;
  }

  public async onCreated(owner: string): Promise<FarmCreatedEvent> {
    const latest = await this.web3.eth.getBlockNumber();
    const options = {
      filter: { account: [owner] },
      fromBlock: latest,
    };

    // TODO if the user cancels the transaction we also need to clear the interval

    // Every second poll for the new ID
    return new Promise((res, rej) => {
      const timer = setInterval(() => {
        this.farm
          .getPastEvents("LandCreated", options)
          .then((results: any) => {
            if (results.length > 0) {
              clearInterval(timer);
              res(results[0].returnValues);
            }
          })
          .catch((err: any) => {
            clearInterval(timer);
            console.log({ err });
            rej(err);
          });
      }, 1000);
    });
  }
}
