import { getItemUnit } from "features/game/lib/conversion";
import { KNOWN_ITEMS } from "features/game/types";
import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem, fromWei } from "web3-utils";
import SessionABI from "./abis/Session.json";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.SESSION_CONTRACT;

type ProgressData = {
  mintIds: number[];
  mintAmounts: string[];
  burnIds: number[];
  burnAmounts: string[];
  statisticIds: number[];
  statisticAmounts: number[];
  tokens: string;
};

export type SyncProgressArgs = {
  signature: string;
  sender: string;
  farmId: number;
  bumpkinId: number;
  deadline: number;
  sessionId: string;
  nextSessionId: string;
  progress: ProgressData;
  fee: string;
};

export type Recipe = {
  mintId: number;
  tokenAmount: number;
  ingredientAmounts: number[];
  ingredientIds: number[];
  cooldownSeconds: number;
  maxSupply: number;
  enabled: boolean;
};

/**
 * Sessions contract
 */
export class SessionManager {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      SessionABI as AbiItem[],
      address as string
    );
  }

  public async getSessionId(farmId: number, attempts = 0): Promise<string> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const sessionId = await this.contract.methods
        .getSessionId(farmId)
        .call({ from: this.account });

      return sessionId;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getSessionId(farmId, attempts + 1);
      }

      throw error;
    }
  }

  /**
   * Poll until data is ready
   */
  public async getNextSessionId(
    farmId: number,
    oldSessionId: string
  ): Promise<string> {
    await new Promise((res) => setTimeout(res, 3000));

    const sessionId = await this.getSessionId(farmId);

    // Try again
    if (sessionId === oldSessionId) {
      return this.getNextSessionId(farmId, oldSessionId);
    }

    return sessionId;
  }

  public async getRecipes(ids: number[], attempts = 0): Promise<Recipe[]> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const recipes: Recipe[] = await this.contract.methods
        .getRecipeBatch(ids)
        .call({ from: this.account });

      // Undefined recipes come back with ID 0. Map the provided ID into the recipe.
      const recipesWithIds = recipes.map((recipe, i) => ({
        ...recipe,
        mintId: ids[i],
      }));

      // For UI purposes, do not show the wei values
      const ethBasedRecipes = recipesWithIds.map((recipe, i) => ({
        ...recipe,

        tokenAmount: recipe.tokenAmount
          ? Number(fromWei(recipe.tokenAmount.toString()))
          : 0,
        ingredientAmounts: recipe.ingredientAmounts.map((amount, index) =>
          Number(
            fromWei(
              amount.toString(),
              getItemUnit(KNOWN_ITEMS[recipe.ingredientIds[index]])
            )
          )
        ),
        cooldownSeconds: Number(recipe.cooldownSeconds),
      }));

      return ethBasedRecipes;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getRecipes(ids, attempts + 1);
      }

      throw error;
    }
  }

  public async getMintedAtBatch(
    farmId: number,
    ids: number[],
    attempts = 0
  ): Promise<number[]> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const mintedAts: number[] = await this.contract.methods
        .getMintedAtBatch(farmId, ids)
        .call({ from: this.account });

      return mintedAts;
    } catch (e) {
      const error = parseMetamaskError(e);

      if (attempts < 3) {
        return this.getMintedAtBatch(farmId, ids, attempts + 1);
      }

      throw error;
    }
  }

  public async sync({
    signature,
    sessionId,
    nextSessionId,
    deadline,
    farmId,
    mintIds,
    mintAmounts,
    burnIds,
    burnAmounts,
    tokens,
    fee,
  }: {
    signature: string;
    sessionId: string;
    nextSessionId: string;
    deadline: number;
    // Data
    farmId: number;
    mintIds: number[];
    mintAmounts: number[];
    burnIds: number[];
    burnAmounts: number[];
    tokens: number;
    fee: string;
  }): Promise<string> {
    const oldSessionId = await this.getSessionId(farmId);
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
      this.contract.methods
        .sync(
          signature,
          sessionId,
          nextSessionId,
          deadline,
          farmId,
          mintIds,
          mintAmounts,
          burnIds,
          burnAmounts,
          tokens,
          fee
        )
        .send({ from: this.account, value: fee, gasPrice })
        .on("error", function (error: any) {
          console.log({ error });
          const parsed = parseMetamaskError(error);
          reject(parsed);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          resolve(receipt);
        });
    });

    const newSessionId = await this.getNextSessionId(farmId, oldSessionId);
    return newSessionId;
  }

  // New sync function for land expansion
  public async syncProgress({
    signature,
    sessionId,
    nextSessionId,
    deadline,
    farmId,
    bumpkinId,
    progress,
    fee,
  }: SyncProgressArgs): Promise<string> {
    const oldSessionId = await this.getSessionId(farmId);
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
      this.contract.methods
        .syncProgress({
          signature,
          farmId,
          bumpkinId,
          deadline,
          sessionId,
          nextSessionId,
          progress,
          fee,
        })
        .send({ from: this.account, value: fee, gasPrice })
        .on("error", function (error: any) {
          const parsed = parseMetamaskError(error);
          reject(parsed);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          resolve(receipt);
        });
    });

    const newSessionId = await this.getNextSessionId(farmId, oldSessionId);
    return newSessionId;
  }

  public async mint({
    signature,
    sessionId,
    nextSessionId,
    deadline,
    farmId,
    mintId,
    fee,
  }: {
    signature: string;
    sessionId: string;
    nextSessionId: string;
    deadline: number;
    // Data
    farmId: number;
    mintId: number;
    fee: string;
  }): Promise<string> {
    const oldSessionId = await this.getSessionId(farmId);
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
      this.contract.methods
        .mint(
          signature,
          sessionId,
          nextSessionId,
          deadline,
          farmId,
          mintId,
          fee
        )
        .send({ from: this.account, value: fee, gasPrice })
        .on("error", function (error: any) {
          console.log({ error });
          const parsed = parseMetamaskError(error);
          reject(parsed);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          resolve(receipt);
        });
    });

    const newSessionId = await this.getNextSessionId(farmId, oldSessionId);
    return newSessionId;
  }

  public async withdraw({
    signature,
    sessionId,
    nextSessionId,
    deadline,
    farmId,
    ids,
    amounts,
    tax,
    sfl,
  }: {
    signature: string;
    sessionId: string;
    nextSessionId: string;
    deadline: number;
    // Data
    farmId: number;
    ids: number[];
    amounts: number[];
    sfl: number;
    tax: number;
  }): Promise<string> {
    const oldSessionId = await this.getSessionId(farmId);
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
      this.contract.methods
        .withdraw(
          signature,
          sessionId,
          nextSessionId,
          deadline,
          farmId,
          ids,
          amounts,
          sfl,
          tax
        )
        .send({ from: this.account, gasPrice })
        .on("error", function (error: any) {
          const parsed = parseMetamaskError(error);
          console.log({ parsedIt: parsed });
          reject(parsed);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          console.log({ receipt });
          resolve(receipt);
        });
    });

    const newSessionId = await this.getNextSessionId(farmId, oldSessionId);
    return newSessionId;
  }

  public async listTrade({
    signature,
    farmId,
    fee,
    resourceAmount,
    resourceId,
    sessionId,
    sfl,
    slotId,
    tax,
    deadline,
    nextSessionId,
  }: {
    signature: string;
    farmId: number;
    fee: string;
    resourceAmount: string;
    resourceId: number;
    sender: string;
    sessionId: string;
    sfl: string;
    slotId: number;
    tax: number;
    deadline: number;
    nextSessionId: string;
  }) {
    const oldSessionId = await this.getSessionId(farmId);
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
      this.contract.methods
        .listTrade(
          signature,
          sessionId,
          nextSessionId,
          deadline,
          slotId,
          farmId,
          resourceId,
          resourceAmount,
          sfl,
          tax,
          fee
        )
        .send({ from: this.account, value: fee, gasPrice })
        .on("error", function (error: any) {
          const parsed = parseMetamaskError(error);
          console.log({ parsedIt: parsed });
          reject(parsed);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          console.log({ receipt });
          resolve(receipt);
        });
    });

    const newSessionId = await this.getNextSessionId(farmId, oldSessionId);
    return newSessionId;
  }

  public async cancelTrade({
    signature,
    sessionId,
    nextSessionId,
    deadline,
    farmId,
    listingId,
  }: {
    signature: string;
    sessionId: string;
    nextSessionId: string;
    deadline: number;
    farmId: number;
    listingId: number;
  }) {
    const oldSessionId = await this.getSessionId(farmId);
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
      this.contract.methods
        .cancelTrade(
          signature,
          sessionId,
          nextSessionId,
          deadline,
          farmId,
          listingId
        )
        .send({ from: this.account, gasPrice })
        .on("error", function (error: any) {
          const parsed = parseMetamaskError(error);
          console.log({ parsedIt: parsed });
          reject(parsed);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          console.log({ receipt });
          resolve(receipt);
        });
    });

    const newSessionId = await this.getNextSessionId(farmId, oldSessionId);
    return newSessionId;
  }

  public async purchaseTrade({
    signature,
    sessionId,
    nextSessionId,
    deadline,
    farmId,
    listingId,
    sfl,
  }: {
    signature: string;
    sessionId: string;
    nextSessionId: string;
    deadline: number;
    farmId: number;
    listingId: number;
    sfl: number;
  }) {
    const oldSessionId = await this.getSessionId(farmId);
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
      this.contract.methods
        .purchaseTrade(
          signature,
          sessionId,
          nextSessionId,
          deadline,
          farmId,
          listingId,
          sfl
        )
        .send({ from: this.account, gasPrice })
        .on("error", function (error: any) {
          const parsed = parseMetamaskError(error);
          console.log({ parsedIt: parsed });
          reject(parsed);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          console.log({ receipt });
          resolve(receipt);
        });
    });

    const newSessionId = await this.getNextSessionId(farmId, oldSessionId);
    return newSessionId;
  }

  public async expandLand({
    signature,
    sessionId,
    nextSessionId,
    deadline,
    farmId,
    sfl,
    nonce,
    metadata,
    resourceIds,
    resourceAmounts,
  }: {
    signature: string;
    sessionId: string;
    nextSessionId: string;
    deadline: number;
    farmId: number;
    sfl: string;
    nonce: string;
    metadata: string;
    resourceIds: number[];
    resourceAmounts: string[];
  }) {
    const oldSessionId = await this.getSessionId(farmId);
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
      this.contract.methods
        .expandLand(
          signature,
          sessionId,
          nextSessionId,
          deadline,
          farmId,
          nonce,
          metadata,
          sfl,
          resourceIds,
          resourceAmounts
        )
        .send({ from: this.account, gasPrice })
        .on("error", function (error: any) {
          const parsed = parseMetamaskError(error);
          console.log({ parsedIt: parsed });
          reject(parsed);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          console.log({ receipt });
          resolve(receipt);
        });
    });

    const newSessionId = await this.getNextSessionId(farmId, oldSessionId);
    return newSessionId;
  }
}
