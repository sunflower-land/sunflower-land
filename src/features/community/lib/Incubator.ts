/**
 * Project Dignity's Incubator
 */
import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import IncubatorABI from "./abis/Incubator.json";
import { estimateGasPrice, parseMetamaskError } from "lib/blockchain/utils";

const address = CONFIG.INCUBATOR_CONTRACT;

/**
 * Incubator contract
 */
export class Incubator {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      IncubatorABI as AbiItem[],
      address as string
    );
  }

  public async getTadpoleIds(attempts = 0): Promise<Array<[]>> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));
    try {
      const tadpoleBalance = await this.contract.methods
        .getTadpolesOfOwner(this.account)
        .call({ from: this.account });

      return tadpoleBalance;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getTadpoleIds(attempts + 1);
      }

      throw error;
    }
  }

  public async incubate(_frogId: string, _tadpoleId: string): Promise<string> {
    const gasPrice = await estimateGasPrice(this.web3);

    return new Promise((resolve, reject) => {
      this.contract.methods
        .incubate([_frogId], [_tadpoleId])
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

  public async remove(_frogId: string, _incubatorId: string): Promise<string> {
    console.log("remove", _frogId, _incubatorId);
    const gasPrice = await estimateGasPrice(this.web3);

    return new Promise((resolve, reject) => {
      this.contract.methods
        .unstake([_frogId], [_incubatorId])
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

  public async claim(_frogId: string, _incubatorId: string): Promise<string> {
    console.log("claim", _frogId, _incubatorId);
    const gasPrice = await estimateGasPrice(this.web3);

    return new Promise((resolve, reject) => {
      this.contract.methods
        .claim([_frogId], [_incubatorId])
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

  // returns total balance of all incubators
  public async incubatorBalanceAll(incubatorIds: string[]) {
    const earnings = await this.contract.methods
      .earningInfo(incubatorIds)
      .call({ from: this.account });

    console.log(incubatorIds);
    console.log("total earnings", earnings);
    return earnings;
  }

  public async incubatorIds(attempts = 0): Promise<string[]> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));
    try {
      const incubatorIds = await this.contract.methods
        .tokensOfOwner(this.account)
        .call({ from: this.account });

      return incubatorIds;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.incubatorIds(attempts + 1);
      }

      throw error;
    }
  }

  public async incubatorEarnings(incubatorId: string) {
    const earnings = await this.contract.methods
      .earningInfo([incubatorId])
      .call({ from: this.account });

    return earnings;
  }

  public async getFrogIdIncubator(
    incubatorId: string,
    attempts = 0
  ): Promise<string> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));
    try {
      const frogId = await this.contract.methods
        .vault(incubatorId)
        .call({ from: this.account });

      return frogId["frogTokenId"];
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getFrogIdIncubator(incubatorId, attempts + 1);
      }

      throw error;
    }
  }
}
