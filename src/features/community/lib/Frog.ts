/**
 * Sunflower Land's first unique Frog NFT :)
 */
import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import FrogABI from "./abis/Frog.json";
import { estimateGasPrice, parseMetamaskError } from "lib/blockchain/utils";

const address = CONFIG.FROG_CONTRACT;

/**
 * Frog NFT contract
 */
export class Frog {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      FrogABI as AbiItem[],
      address as string
    );
  }

  public async mintFrog({
    _pid,
    _farmId,
  }: {
    _pid: number;
    _farmId: number;
  }): Promise<string> {
    const gasPrice = await estimateGasPrice(this.web3);

    return new Promise((resolve, reject) => {
      this.contract.methods
        .mint(_pid, _farmId)
        .send({ from: this.account, gasPrice })
        .on("error", function (error: any) {
          const parsed = parseMetamaskError(error);

          reject(parsed);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log("TRANS HASH:" + { transactionHash });
        })
        .on("receipt", function (receipt: any) {
          console.log({ receipt });
          resolve(receipt);
        });
    });
  }

  public async getTotalSupply(attempts = 0): Promise<number> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const frogs = await this.contract.methods
        .totalSupply()
        .call({ from: this.account });

      return frogs;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getTotalSupply(attempts + 1);
      }

      throw error;
    }
  }

  public async isWhitelistingEnabled(attempts = 0): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const isEnabled = await this.contract.methods
        .whitelistOnly()
        .call({ from: this.account });

      return isEnabled;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.isWhitelistingEnabled(attempts + 1);
      }

      throw error;
    }
  }

  public async isWalletWhitelisted(attempts = 0): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));
    console.log(this.account);

    try {
      const isWhitelisted = await this.contract.methods
        .isAddressWhitelisted(this.account)
        .call({ from: this.account });

      return isWhitelisted;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.isWhitelistingEnabled(attempts + 1);
      }

      throw error;
    }
  }

  public async isWalletBlacklisted(attempts = 0): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));
    console.log(this.account);

    try {
      const isWhitelisted = await this.contract.methods
        .isAddressBlacklisted(this.account)
        .call({ from: this.account });

      return isWhitelisted;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.isWalletBlacklisted(attempts + 1);
      }

      throw error;
    }
  }

  public async getFrogIds(
    owner: string | undefined,
    attempts = 0
  ): Promise<string[]> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const frogIds = await this.contract.methods
        .walletOfOwner(owner || this.account)
        .call({ from: this.account });

      return frogIds;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getFrogIds(owner, attempts + 1);
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

  public async setApprovalAllFrogs(
    address: string,
    approve: boolean,
    attempts = 0
  ): Promise<string> {
    const gasPrice = await estimateGasPrice(this.web3);
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const approveAllFrogs = await this.contract.methods
        .setApprovalForAll(address, approve)
        .send({ from: this.account, gasPrice });

      return approveAllFrogs;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.setApprovalAllFrogs(address, approve, attempts + 1);
      }

      throw error;
    }
  }

  public async isApprovedForAll(
    operator: string,
    attempts = 0
  ): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const isApproved = await this.contract.methods
        .isApprovedForAll(this.account, operator)
        .call({ from: this.account });

      return isApproved;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.isApprovedForAll(operator, attempts + 1);
      }

      throw error;
    }
  }
}
