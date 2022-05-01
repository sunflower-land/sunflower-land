import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import SunflowerFarmersABI from "./abis/SunflowerFarmers.json";
import TokenABI from "./abis/Token.json";
import { parseMetamaskError } from "./utils";

const farmContractAddress =
  CONFIG.NETWORK === "mainnet"
    ? "0x6e5Fa679211d7F6b54e14E187D34bA547c5d3fe0"
    : "0xd7952E176fe0B77cAAb2465b04F1422518Fb9643";
const farmTokenAddress =
  CONFIG.NETWORK === "mainnet"
    ? "0xdf9B4b57865B403e08c85568442f95c26b7896b0"
    : "0x1D24F82b5d9d72450C2ed065F51827Eb280FFA38";

/**
 * Farm NFT contract
 */
export class SunflowerFarmers {
  private web3: Web3;
  private account: string;

  private farm: any;
  private token: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.farm = new this.web3.eth.Contract(
      SunflowerFarmersABI as AbiItem[],
      farmContractAddress as string
    );
    this.token = new this.web3.eth.Contract(
      TokenABI as AbiItem[],
      farmTokenAddress as string
    );
  }

  public async hasFarm(address: string, attempts = 0): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const land = await this.farm.methods
        .getLand(address)
        .call({ from: address });

      console.log({ land });
      return land.length >= 5;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.hasFarm(address, attempts + 1);
      }

      throw error;
    }
  }

  public async hasTokens(address: string, attempts = 0): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const balance = await this.token.methods
        .balanceOf(address)
        .call({ from: address });

      console.log({ balance });
      return Number(balance) > 0;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.hasTokens(address, attempts + 1);
      }

      throw error;
    }
  }

  public async hasV1Data(address = this.account): Promise<boolean> {
    const hasTokens = await this.hasTokens(address);
    const hasFarm = await this.hasFarm(address);

    return hasFarm || hasTokens;
  }
}
