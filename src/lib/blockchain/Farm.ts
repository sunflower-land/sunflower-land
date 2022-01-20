import Web3 from "web3";
import { AbiItem } from "web3-utils";
import FarmABI from "./abis/Farm.json";

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
      "0x191d3cd967bb3d51fab4d03dc2383cc8f8afc6f3"
    );
  }

  public async getFarmIds(): Promise<number[]> {
    const balance = await this.farm.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    if (balance === 0) {
      return [];
    }

    const items = Array(Number(balance)).fill(null);

    // Loop through and find the tokenID they own
    const tokenIds: number[] = await items.reduce(
      async (tokenIds, _, index) => {
        const ids = await tokenIds;

        const tokenId = await this.farm.methods
          .tokenOfOwnerByIndex(this.account, index.toString())
          .call({ from: this.account });

        return [...ids, tokenId];
      },
      Promise.resolve([])
    );

    return tokenIds;
  }
}
