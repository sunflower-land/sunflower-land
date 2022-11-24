import { pingHealthCheck } from "web3-health-check";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { sequence } from "0xsequence";
import { AbiItem, toHex, toWei } from "web3-utils";
import { ERRORS } from "lib/errors";
import Web3 from "web3";
import { CONFIG } from "lib/config";
import { Frog } from "./Frog";
import { Tadpole } from "./Tadpole";
import { Incubator } from "./Incubator";
import { WhitelistToken } from "./WhitelistToken";
import TokenJSON from "lib/blockchain/abis/Token.json";
import { SunflowerLandToken } from "lib/blockchain/types";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

/**
 * A wrapper of Web3 which handles retries and other common errors.
 */
export class CommunityContracts {
  private web3: Web3 | null = null;
  private frog: Frog | null = null;
  private tadpole: Tadpole | null = null;
  private incubator: Incubator | null = null;
  private whitelist_token: WhitelistToken | null = null;

  private account: string | null = null;

  private async initialiseContracts() {
    try {
      try {
        this.frog = new Frog(this.web3 as Web3, this.account as string);
        this.tadpole = new Tadpole(this.web3 as Web3, this.account as string);
        this.incubator = new Incubator(
          this.web3 as Web3,
          this.account as string
        );
        this.whitelist_token = new WhitelistToken(
          this.web3 as Web3,
          this.account as string
        );
      } catch (e) {
        console.error("Unable to initialise frog contract", e);
      }

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
    console.log("HI COMMUNITY");
    try {
      const providerz = new WalletConnectProvider({
        rpc: {
          80001: "https://matic-mumbai.chainstacklabs.com",
        },
      });
      //  Enable session (triggers QR Code modal)
      await providerz.enable();
      this.web3 = new Web3(providerz as any);
    } catch (e) {
      console.log(e);
    }
    console.log("BYE");
    return;

    const wallet = await sequence.initWallet("mumbai");
    const provider = wallet.getProvider();
    if (provider) {
      this.web3 = new Web3(provider as any);
      const address = CONFIG.TOKEN_CONTRACT;

      try {
        console.log("ETHERS");

        const testContract = new ethers.Contract(
          CONFIG.TOKEN_CONTRACT as string,
          TokenJSON as any,
          provider
        );
        console.log(await testContract.balanceOf(address as string));
        console.log("END ETHERS");
      } catch (e) {
        console.log(e);
      }

      try {
        console.log("WEB3");
        const contract = new this.web3.eth.Contract(
          TokenJSON as AbiItem[],
          address as string
        ) as unknown as SunflowerLandToken;

        const balance = await contract.methods
          .balanceOf(address as string)
          .call();
        console.log(balance);

        console.log("END WEB3");
      } catch (e) {
        console.log(e);
      }

      console.log("BYE COMMUNITY");
    }

    // TODO add type support
    else if ((window as any).ethereum) {
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
    if (window.location.hostname == "localhost") {
      return true;
    }

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

  public getFrog() {
    return this.frog as Frog;
  }

  public getTadpole() {
    return this.tadpole as Tadpole;
  }

  public getIncubator() {
    return this.incubator as Incubator;
  }

  public getWhitelistToken() {
    return this.whitelist_token as WhitelistToken;
  }

  public get myAccount() {
    return this.account;
  }

  public async donate(donation: number, to = CONFIG.FROG_DONATION as string) {
    const gasPrice = await estimateGasPrice(this.web3 as Web3);

    try {
      await this.web3?.eth.sendTransaction({
        from: communityContracts.myAccount as string,
        to,
        value: toHex(toWei(donation.toString(), "ether")),
        gasPrice,
      });
    } catch (error: any) {
      const parsed = parseMetamaskError(error);

      throw parsed;
    }
  }
}

export const communityContracts = new CommunityContracts();
