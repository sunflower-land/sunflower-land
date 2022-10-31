/**
 * Project Dignity's first airdrop event - Tadpoles
 */
import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import TadpoleABI from "./abis/Tadpole.json";
import { estimateGasPrice, parseMetamaskError } from "lib/blockchain/utils";

const address = CONFIG.TADPOLE_CONTRACT;

/**
 * Tadpole NFT contract
 */
export class Tadpole {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      TadpoleABI as AbiItem[],
      address as string
    );
  }

  public async getTadpoleHealth(
    tokenId: number[],
    attempts = 0
  ): Promise<string> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const healthScale = ["healthy", "chipped", "cracked", "damaged", "dying"];
      const tadpoleHealthId = await this.contract.methods
        .tadpoleStage(tokenId)
        .call({ from: this.account });

      return healthScale[tadpoleHealthId];
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getTadpoleHealth(tokenId, attempts + 1);
      }

      throw error;
    }
  }

  public async setApprovalAllTadpoles(
    address: string,
    approve: boolean,
    attempts = 0
  ): Promise<string> {
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const approveAllTadpoles = await this.contract.methods
        .setApprovalForAll(address, approve)
        .send({ from: this.account, gasPrice });

      return approveAllTadpoles;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.setApprovalAllTadpoles(address, approve, attempts + 1);
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
