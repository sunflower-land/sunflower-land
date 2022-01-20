import { ERRORS } from "lib/errors";
import Web3 from "web3";
import { sha3 } from "web3-utils";
import { LegacyFarm } from "./Legacy";
import { Farm } from "./Farm";

/**
 * A wrapper of Web3 which handles retries and other common errors.
 */
export class Metamask {
  private web3: Web3 | null = null;

  private legacyFarm: LegacyFarm | null = null;
  private farm: Farm | null = null;

  private account: string | null = null;

  private async initialiseContracts() {
    try {
      this.legacyFarm = new LegacyFarm(
        this.web3 as Web3,
        this.account as string
      );

      this.farm = new Farm(this.web3 as Web3, this.account as string);
    } catch (e: any) {
      // Timeout, retry
      if (e.code === "-32005") {
        console.error("Retrying...");
        await new Promise((res) => window.setTimeout(res, 3000));
      } else {
        console.error(e);
        throw e;
      }
    }
  }

  private async setupWeb3() {
    // TODO add type support
    if ((window as any).ethereum) {
      try {
        // Request account access if needed
        await (window as any).ethereum.enable();
        this.web3 = new Web3((window as any).ethereum);
      } catch (error) {
        // User denied account access...
        console.error(error);
      }
    } else if ((window as any).web3) {
      this.web3 = new Web3((window as any).web3.currentProvider);
    } else {
      throw new Error(ERRORS.NO_WEB3);
    }
  }

  private async loadAccount() {
    if (!this.web3) {
      throw new Error(ERRORS.NO_WEB3);
    }

    const maticAccounts = await this.web3.eth.getAccounts();
    this.account = maticAccounts[0];
  }

  public async initialise(retryCount = 0): Promise<void> {
    try {
      // It is actually quite fast, we won't to simulate slow loading to convey complexity
      console.log("lets go!");
      await this.setupWeb3();
      await this.loadAccount();

      const chainId = await this.web3?.eth.getChainId();

      if (chainId !== 137) {
        throw new Error(ERRORS.WRONG_CHAIN);
      }

      await this.initialiseContracts();
    } catch (e: any) {
      console.log({ e });
      // If it is a user error, we don't want to retry
      if (e.message === ERRORS.WRONG_CHAIN || e.message === ERRORS.NO_WEB3) {
        throw e;
      }

      // If it is not a known error, keep trying
      if (retryCount < 3) {
        await new Promise((res) => setTimeout(res, 2000));

        return this.initialise(retryCount + 1);
      }

      throw e;
    }
  }

  public async signTransaction() {
    if (!this.web3) {
      throw new Error(ERRORS.NO_WEB3);
    }

    const stringToHash = "Hello";
    const hash = sha3(stringToHash) as string;
    const signature = await this.web3.eth.personal.sign(
      hash,
      this.account as string,
      "dog"
    );

    // Example of verifying a transaction on the backend
    //const signingAddress = this.web3.eth.accounts.recover(hash, signature);

    return signature;
  }

  public getLegacyFarm() {
    return this.legacyFarm;
  }

  public getFarm() {
    return this.farm;
  }
}

export const metamask = new Metamask();
