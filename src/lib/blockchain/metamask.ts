import { pingHealthCheck } from "web3-health-check";
import { ERRORS } from "lib/errors";
import Web3 from "web3";
import { SessionManager } from "./Sessions";
import { Farm } from "./Farm";
import { Beta } from "./Beta";
import { Inventory } from "./Inventory";
import { Pair } from "./Pair";
import { WishingWell } from "./WishingWell";
import { Token } from "./Token";
import { toHex, toWei } from "web3-utils";
import { CONFIG } from "lib/config";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { SunflowerFarmers } from "./SunflowerFarmers";

/**
 * A wrapper of Web3 which handles retries and other common errors.
 */
export class Metamask {
  private web3: Web3 | null = null;

  private farm: Farm | null = null;
  private sunflowerFarmers: SunflowerFarmers | null = null;
  private session: SessionManager | null = null;
  private beta: Beta | null = null;
  private inventory: Inventory | null = null;
  private pair: Pair | null = null;
  private wishingWell: WishingWell | null = null;
  private token: Token | null = null;

  private account: string | null = null;

  private async initialiseContracts() {
    try {
      // this.legacyFarm = new LegacyFarm(
      //   this.web3 as Web3,
      //   this.account as string
      // );

      this.farm = new Farm(this.web3 as Web3, this.account as string);
      this.sunflowerFarmers = new SunflowerFarmers(
        this.web3 as Web3,
        this.account as string
      );
      this.session = new SessionManager(
        this.web3 as Web3,
        this.account as string
      );
      this.beta = new Beta(this.web3 as Web3, this.account as string);
      this.inventory = new Inventory(this.web3 as Web3, this.account as string);
      this.pair = new Pair(this.web3 as Web3, this.account as string);
      this.token = new Token(this.web3 as Web3, this.account as string);
      this.wishingWell = new WishingWell(
        this.web3 as Web3,
        this.account as string
      );

      const isHealthy = await this.healthCheck();

      // Maintainers of package typed incorrectly
      if (!isHealthy) {
        throw new Error("Unable to reach Polygon");
      }
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
        console.error("Error inside setupWeb3", error);
      }
    } else if ((window as any).web3) {
      this.web3 = new Web3((window as any).web3.currentProvider);
    } else {
      throw new Error(ERRORS.NO_WEB3);
    }
  }

  public async healthCheck() {
    const statusCode = await pingHealthCheck(
      this.web3 as Web3,
      this.account as string
    );

    const isHealthy = (statusCode as any) !== 500;

    return isHealthy;
  }

  public async getAccount() {
    if (!this.web3) {
      throw new Error(ERRORS.NO_WEB3);
    }

    const maticAccounts = await this.web3.eth.getAccounts();
    return maticAccounts[0];
  }

  private async loadAccount() {
    this.account = await this.getAccount();
  }

  public async initialise(retryCount = 0): Promise<void> {
    try {
      // Smooth out the loading state
      await new Promise((res) => setTimeout(res, 1000));
      await this.setupWeb3();
      await this.loadAccount();

      const chainId = await this.web3?.eth.getChainId();

      if (!(chainId === CONFIG.POLYGON_CHAIN_ID)) {
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

  public async signTransaction(nonce: number, account = this.account) {
    if (!this.web3) {
      throw new Error(ERRORS.NO_WEB3);
    }

    const message = this.generateSignatureMessage({
      address: account as string,
      nonce,
    });

    try {
      const signature = await this.web3.eth.personal.sign(
        message,
        account as string,
        // Empty password, handled by Metamask
        ""
      );

      return {
        signature,
      };
    } catch (error: any) {
      const parsed = parseMetamaskError(error);
      throw parsed;
    }
  }

  private generateSignatureMessage({
    address,
    nonce,
  }: {
    address: string;
    nonce: number;
  }) {
    const MESSAGE = `🌻 Welcome to Sunflower Land! 🌻\n\nClick to sign in and accept the Sunflower Land\n📜 Terms of Service:\nhttps://docs.sunflower-land.com/support/terms-of-service\n\nThis request will not trigger a blockchain\ntransaction or cost any gas fees.\n\nYour authentication status will reset after\neach session.\n\n👛 Wallet address:\n${address.substring(
      0,
      19
    )}...${address.substring(24)}\n\n🔑 Nonce: ${nonce}`;
    return MESSAGE;
  }

  private getDefaultChainParam() {
    if (CONFIG.POLYGON_CHAIN_ID === 137) {
      return {
        chainId: `0x${Number(CONFIG.POLYGON_CHAIN_ID).toString(16)}`,
        chainName: "Polygon Mainnet",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"],
      };
    } else {
      return {
        chainId: `0x${Number(CONFIG.POLYGON_CHAIN_ID).toString(16)}`,
        chainName: "Polygon Testnet Mumbai",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
      };
    }
  }

  public async checkDefaultNetwork() {
    const chainId = await this.web3?.eth.getChainId();
    return chainId === CONFIG.POLYGON_CHAIN_ID;
  }

  public async switchNetwork() {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        { chainId: `0x${Number(CONFIG.POLYGON_CHAIN_ID).toString(16)}` },
      ],
    });
  }

  public async addNetwork() {
    try {
      const defaultChainParam = this.getDefaultChainParam();
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...defaultChainParam,
          },
        ],
      });
    } catch (addError) {
      throw new Error(ERRORS.WRONG_CHAIN);
    }
  }

  public async initialiseNetwork() {
    try {
      await this.switchNetwork();
    } catch (e: any) {
      if (e.code === 4902) {
        await this.addNetwork();
      }
      throw e;
    }
  }

  public async donate(
    donation: number,
    to = CONFIG.DONATION_ADDRESS as string
  ) {
    const gasPrice = await estimateGasPrice(this.web3 as Web3);

    try {
      await this.web3?.eth.sendTransaction({
        from: metamask.myAccount as string,
        to,
        value: toHex(toWei(donation.toString(), "ether")),
        gasPrice,
      });
    } catch (error: any) {
      const parsed = parseMetamaskError(error);

      throw parsed;
    }
  }

  public getFarm() {
    return this.farm as Farm;
  }

  public getSunflowerFarmers() {
    return this.sunflowerFarmers as SunflowerFarmers;
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

  public getPair() {
    return this.pair as Pair;
  }

  public getWishingWell() {
    return this.wishingWell as WishingWell;
  }

  public getToken() {
    return this.token as Token;
  }

  public get myAccount() {
    return this.account;
  }

  public async getBlockNumber() {
    try {
      const number = await this.web3?.eth.getBlockNumber();

      if (!number) {
        throw new Error(ERRORS.NETWORK_CONGESTED);
      }

      return number;
    } catch (error: any) {
      const parsed = parseMetamaskError(error);

      throw parsed;
    }
  }
}

export const metamask = new Metamask();
