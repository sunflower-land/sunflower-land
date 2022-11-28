import { pingHealthCheck } from "web3-health-check";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { toHex, toWei } from "web3-utils";
import { ERRORS } from "lib/errors";
import Web3 from "web3";
import { CONFIG } from "lib/config";
import { Frog } from "./Frog";
import { Tadpole } from "./Tadpole";
import { Incubator } from "./Incubator";
import { WhitelistToken } from "./WhitelistToken";

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

  public async initialise(provider: any, retryCount = 0): Promise<void> {
    try {
      // Smooth out the loading state
      await new Promise((res) => setTimeout(res, 1000));
      this.web3 = new Web3(provider);
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
