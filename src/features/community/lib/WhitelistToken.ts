/**
 * Project Dignity's Whitelist Token
 */
import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import WhitelistTokenABI from "./abis/WhitelistToken.json";

const address = CONFIG.WHITELIST_TOKEN_CONTRACT;

/**
 * Whitelist Token contract
 */
export class WhitelistToken {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      WhitelistTokenABI as AbiItem[],
      address as string
    );
  }

  public async balanceOf() {
    const balance = await this.contract.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    return balance;
  }
}
