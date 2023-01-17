/**
 * Project Dignity Seals :)
 */
import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import SealABI from "./abis/Seal.json";
import { parseMetamaskError } from "lib/blockchain/utils";

const address = CONFIG.SEAL_CONTRACT;

/**
 * Seal NFT contract
 */
export class Seal {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      SealABI as AbiItem[],
      address as string
    );
  }

  public async getTotalSupply(attempts = 0): Promise<number> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const seals = await this.contract.methods
        .totalSupply()
        .call({ from: this.account });

      return seals;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getTotalSupply(attempts + 1);
      }

      throw error;
    }
  }

  public async getSealIds(
    owner: string | undefined,
    attempts = 0
  ): Promise<string[]> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const sealIds = await this.contract.methods
        .walletOfOwnerSeals(owner || this.account)
        .call({ from: this.account });

      return sealIds;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getSealIds(owner, attempts + 1);
      }

      throw error;
    }
  }

  public async getBaseUri(attempts = 0): Promise<string> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const baseUri = await this.contract.methods
        .baseURI()
        .call({ from: this.account });

      return baseUri;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getBaseUri(attempts + 1);
      }

      throw error;
    }
  }

  public async getTokenUri(tokenId: string, attempts = 0): Promise<string> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const tokenUri = await this.contract.methods
        .tokenURI(tokenId)
        .call({ from: this.account });

      return tokenUri;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getTokenUri(tokenId, attempts + 1);
      }

      throw error;
    }
  }
}
