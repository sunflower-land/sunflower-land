import { pingHealthCheck } from "web3-health-check";
import { ERRORS } from "lib/errors";
import Web3 from "web3";

import { fromWei, toBN, toHex, toWei } from "web3-utils";
import { CONFIG } from "lib/config";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import Decimal from "decimal.js-light";
import { Web3SupportedProviders } from "lib/web3SupportedProviders";

const UNISWAP_ROUTER = CONFIG.QUICKSWAP_ROUTER_CONTRACT;
const WMATIC_ADDRESS = CONFIG.WMATIC_CONTRACT;
const SFL_TOKEN_ADDRESS = CONFIG.TOKEN_CONTRACT;

/**
 * A wrapper of Web3 which handles retries and other common errors.
 */
export class Wallet {
  private web3: Web3 = new Web3(
    CONFIG.NETWORK === "mainnet"
      ? "https://rpc-mainnet.maticvigil.com"
      : "https://rpc-amoy.polygon.technology"
  );

  private account: string | null = null;

  private type: Web3SupportedProviders | null = null;
  private rawProvider: any | null = null;

  private async initialiseContracts() {
    try {
      // TODO - initialise a test contract???
      // const isHealthy = await this.healthCheck();
      // Maintainers of package typed incorrectly
      // if (!isHealthy) {
      //   throw new Error("Unable to reach Polygon");
      // }
    } catch (e: any) {
      // Timeout, retry
      if (e.code === "-32005") {
        // eslint-disable-next-line no-console
        console.error("Retrying...");
        await new Promise((res) => window.setTimeout(res, 3000));
      } else {
        // eslint-disable-next-line no-console
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

  private async getAccount() {
    if (!this.web3) {
      throw new Error(ERRORS.NO_WEB3);
    }

    const maticAccounts = await this.web3.eth.getAccounts();
    return maticAccounts[0];
  }

  private async loadAccount() {
    this.account = await this.getAccount();
  }

  public async getMaticBalance() {
    if (!this.web3) {
      throw new Error(ERRORS.NO_WEB3);
    }

    const balance = await this.web3?.eth.getBalance(this.account as string);

    return new Decimal(balance);
  }

  public async initialise(
    provider: any,
    type: Web3SupportedProviders,
    retryCount = 0
  ): Promise<void> {
    this.type = type;
    try {
      // Smooth out the loading state
      await new Promise((res) => setTimeout(res, 1000));
      this.web3 = new Web3(provider);
      this.rawProvider = provider;
      await this.loadAccount();

      const chainId = await this.web3?.eth.getChainId();

      if (!(chainId === CONFIG.POLYGON_CHAIN_ID)) {
        await this.initialiseNetwork(provider);
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

        return this.initialise(provider, type, retryCount + 1);
      }

      throw e;
    }
  }

  public isAlchemy = false;
  public async overrideProvider() {
    this.isAlchemy = true;

    if (CONFIG.ALCHEMY_RPC) {
      // eslint-disable-next-line no-console
      console.log("Provider overridden");

      let web3;

      if (this.type === Web3SupportedProviders.METAMASK) {
        web3 = createAlchemyWeb3(CONFIG.ALCHEMY_RPC);
      } else {
        web3 = createAlchemyWeb3(CONFIG.ALCHEMY_RPC, {
          writeProvider: this.rawProvider,
        });
      }

      this.web3 = new Web3(web3 as any);

      await this.initialiseContracts();
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
        chainName: "Polygon Testnet Amoy",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: ["https://rpc-amoy.polygon.technology"],
        blockExplorerUrls: ["https://www.oklink.com/amoy/"],
      };
    }
  }

  public async checkDefaultNetwork() {
    const chainId = await this.web3?.eth.getChainId();
    return chainId === CONFIG.POLYGON_CHAIN_ID;
  }

  public async switchNetwork(provider: any) {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [
        { chainId: `0x${Number(CONFIG.POLYGON_CHAIN_ID).toString(16)}` },
      ],
    });
  }

  public async addNetwork(provider: any) {
    try {
      const defaultChainParam = this.getDefaultChainParam();
      await provider.request({
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

  public async initialiseNetwork(provider: any) {
    try {
      await this.switchNetwork(provider);
    } catch (e: any) {
      if (e.code === 4902) {
        await this.addNetwork(provider);
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
        from: wallet.myAccount as string,
        to,
        value: toHex(toWei(donation.toString(), "ether")),
        gasPrice,
      });
    } catch (error: any) {
      const parsed = parseMetamaskError(error);

      throw parsed;
    }
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

  public async addTokenToMetamask() {
    try {
      const tokenSymbol = "SFL";
      const tokenDecimals = 18;

      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: CONFIG.TOKEN_CONTRACT,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image:
              "https://github.com/sunflower-land/sunflower-land/blob/main/src/assets/brand/icon.png?raw=true",
          },
        },
      });
    } catch (error: any) {
      const parsed = parseMetamaskError(error);

      throw parsed;
    }
  }

  public get web3Provider() {
    return this.web3;
  }

  public async getSFLForMatic(matic: string) {
    if (!this.web3) {
      throw new Error(ERRORS.NO_WEB3);
    }

    const encodedFunctionSignature = this.web3.eth.abi.encodeFunctionSignature(
      "getAmountsOut(uint256,address[])"
    );

    const maticMinusFee = toBN(matic).mul(toBN(950)).div(toBN(1000));

    const encodedParameters = this.web3.eth.abi
      .encodeParameters(
        ["uint256", "address[]"],
        [maticMinusFee, [WMATIC_ADDRESS, SFL_TOKEN_ADDRESS]]
      )
      .substring(2);

    const data = encodedFunctionSignature + encodedParameters;

    const result = await this.web3.eth.call({ to: UNISWAP_ROUTER, data });
    const decodedResult = this.web3.eth.abi.decodeParameter(
      "uint256[]",
      result
    );

    return Number(fromWei(toBN(decodedResult[1])));
  }

  public async getMaticForSFL(sfl: string) {
    if (!this.web3) {
      throw new Error(ERRORS.NO_WEB3);
    }

    const encodedFunctionSignature = this.web3.eth.abi.encodeFunctionSignature(
      "getAmountsIn(uint256,address[])"
    );

    const encodedParameters = this.web3.eth.abi
      .encodeParameters(
        ["uint256", "address[]"],
        [toBN(sfl), [SFL_TOKEN_ADDRESS, WMATIC_ADDRESS]]
      )
      .substring(2);

    const data = encodedFunctionSignature + encodedParameters;

    const result = await this.web3.eth.call({ to: UNISWAP_ROUTER, data });
    const decodedResult = this.web3.eth.abi.decodeParameter(
      "uint256[]",
      result
    );

    const maticWithFee = Number(
      fromWei(toBN(decodedResult[1]).mul(toBN(1050)).div(toBN(1000)))
    );

    return maticWithFee;
  }
}

export const wallet = new Wallet();
