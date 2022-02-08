import { ERRORS } from "lib/errors";
import Web3 from "web3";
import { SessionManager } from "./Sessions";
import { Farm } from "./Farm";
import { Beta } from "./Beta";
import { Inventory } from "./Inventory";

const NETWORK = import.meta.env.VITE_NETWORK;

const POLYGON_TESTNET_CHAIN_ID = NETWORK === "mainnet" ? 137 : 80001;

/**
 * A wrapper of Web3 which handles retries and other common errors.
 */
export class Metamask {
  private web3: Web3 | null = null;

  private farm: Farm | null = null;
  private session: SessionManager | null = null;
  private beta: Beta | null = null;
  private inventory: Inventory | null = null;

  private account: string | null = null;

  private async initialiseContracts() {
    try {
      // this.legacyFarm = new LegacyFarm(
      //   this.web3 as Web3,
      //   this.account as string
      // );

      this.farm = new Farm(this.web3 as Web3, this.account as string);
      this.session = new SessionManager(
        this.web3 as Web3,
        this.account as string
      );
      this.beta = new Beta(this.web3 as Web3, this.account as string);
      this.inventory = new Inventory(this.web3 as Web3, this.account as string);
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
      // Smooth out the loading state
      await new Promise((res) => setTimeout(res, 1000));
      await this.setupWeb3();
      await this.loadAccount();

      const chainId = await this.web3?.eth.getChainId();
      if (!(chainId === POLYGON_TESTNET_CHAIN_ID)) {
        throw new Error(ERRORS.WRONG_CHAIN);
      }

      await this.initialiseContracts();
    } catch (e: any) {
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

    const message = this.generateSignatureMessage({
      address: this.account as string,
    });

    const signature = await this.web3.eth.personal.sign(
      message,
      this.account as string,
      // Empty password, handled by Metamask
      ""
    );

    const recovered = await this.web3.eth.accounts.recover(message, signature);

    // Example of verifying a transaction on the backend
    //const signingAddress = this.web3.eth.accounts.recover(hash, signature);

    return {
      signature,
    };
  }

  private generateSignatureMessage({ address }: { address: string }) {
    const MESSAGE = [
      "Welcome to Sunflower Land!",
      "Click to sign in and accept the Sunflower Land Terms of Service: https://docs.sunflower-land.com/support/terms-of-service",
      "This request will not trigger a blockchain transaction or cost any gas fees.",
      "Your authentication status will reset after each session.",
      `Wallet address: ${address}`,
    ].join("\n\n");

    return MESSAGE;
  }

  public getFarm() {
    return this.farm as Farm;
  }

  public getInventory() {
    return this.inventory as Inventory;
  }

  public getBeta() {
    return this.beta as Beta;
  }

  public getSessionManager() {
    return this.session as SessionManager;
  }

  public get myAccount() {
    return this.account;
  }
}

export const metamask = new Metamask();
