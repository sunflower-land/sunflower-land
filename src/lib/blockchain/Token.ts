import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import TokenJSON from "./abis/Token.json";

const address = CONFIG.TOKEN_CONTRACT;

/**
 * Token contract
 */
export class Token {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      TokenJSON as AbiItem[],
      address as string
    );
  }

  /**
   * Keep full wei amount as used for approving/sending
   */
  public async balanceOf(address: string) {
    const balance = await this.contract.methods
      .balanceOf(address)
      .call({ from: this.account });

    return balance;
  }

  /**
   * Onchain SFL balance
   */
  public async totalSupply() {
    const supply = await this.contract.methods
      .totalSupply()
      .call({ from: this.account });

    return supply;
  }
}
