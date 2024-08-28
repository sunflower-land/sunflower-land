import { ERRORS } from "lib/errors";

import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";
import Decimal from "decimal.js-light";
import {
  getAccount,
  getBalance,
  getChainId,
  readContract,
  sendTransaction,
  switchChain,
} from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { formatEther, parseEther } from "viem";

const UNISWAP_ROUTER = CONFIG.QUICKSWAP_ROUTER_CONTRACT;
const WMATIC_ADDRESS = CONFIG.WMATIC_CONTRACT;
const SFL_TOKEN_ADDRESS = CONFIG.TOKEN_CONTRACT;

/**
 * A wrapper of Viem which handles retries and other common errors.
 */
export class Wallet {
  public getAccount() {
    const { address } = getAccount(config);

    if (!address) {
      throw new Error(ERRORS.NO_WEB3);
    }

    return address;
  }

  public async getMaticBalance() {
    const response = await getBalance(config, {
      address: this.getAccount(),
    });
    return Number(response.value);
  }

  public async checkDefaultNetwork() {
    const chainId = getChainId(config);
    return chainId === CONFIG.POLYGON_CHAIN_ID;
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
        blockExplorerUrls: ["https://amoy.polygonscan.com/"],
      };
    }
  }

  public async switchNetwork() {
    await switchChain(config, {
      chainId: CONFIG.POLYGON_CHAIN_ID as 137 | 80002,
      addEthereumChainParameter: this.getDefaultChainParam(),
    });
  }

  public async initialiseNetwork() {
    await this.switchNetwork();
  }

  public async donate(
    donation: number,
    to = CONFIG.DONATION_ADDRESS as `0x${string}`,
  ) {
    await sendTransaction(config, {
      to,
      value: parseEther(donation.toString()),
    });
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

  public async getSFLForMatic(matic: string) {
    const maticMinusFee = (BigInt(matic) * BigInt(950)) / BigInt(1000);

    const result = await readContract(config, {
      abi: [
        {
          inputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "address[]", name: "path", type: "address[]" },
          ],
          name: "getAmountsOut",
          outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      address: UNISWAP_ROUTER as `0x${string}`,
      functionName: "getAmountsOut",
      args: [maticMinusFee, [WMATIC_ADDRESS, SFL_TOKEN_ADDRESS]],
    });

    // decodedResult[0] is the amount of Matic needed to buy SFL
    // decodedResult[1] is the amount of SFL to be bought
    return new Decimal(formatEther(result[1]));
  }

  public async getMaticForSFL(sfl: string) {
    const result = await readContract(config, {
      abi: [
        {
          inputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "address[]", name: "path", type: "address[]" },
          ],
          name: "getAmountsIn",
          outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      address: UNISWAP_ROUTER as `0x${string}`,
      functionName: "getAmountsIn",
      args: [BigInt(sfl), [WMATIC_ADDRESS, SFL_TOKEN_ADDRESS]],
    });

    // decodedResult[0] is the amount of Matic needed to buy SFL
    // decodedResult[1] is the amount of SFL to be bought
    const maticWithFee = new Decimal(
      formatEther((result[0] / BigInt(950)) * BigInt(1000)),
    );

    return maticWithFee;
  }
}

export const wallet = new Wallet();

export function generateSignatureMessage({
  address,
  nonce,
}: {
  address: string;
  nonce: number;
}) {
  const MESSAGE = `🌻 Welcome to Sunflower Land! 🌻\n\nClick to sign in and accept the Sunflower Land\n📜 Terms of Service:\nhttps://docs.sunflower-land.com/support/terms-of-service\n\nThis request will not trigger a blockchain\ntransaction or cost any gas fees.\n\nYour authentication status will reset after\neach session.\n\n👛 Wallet address:\n${address.substring(
    0,
    19,
  )}...${address.substring(24)}\n\n🔑 Nonce: ${nonce}`;
  return MESSAGE;
}
