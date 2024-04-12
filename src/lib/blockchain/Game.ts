import { getItemUnit } from "features/game/lib/conversion";
import { KNOWN_ITEMS } from "features/game/types";
import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem, fromWei } from "web3-utils";
import GameABI from "./abis/SunflowerLandGame.json";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { getNextSessionId, getSessionId } from "./Session";

const address = CONFIG.GAME_CONTRACT;

type ProgressData = {
  mintIds: number[];
  mintAmounts: string[];
  burnIds: number[];
  burnAmounts: string[];
  wearableIds: number[];
  wearableAmounts: number[];
  tokens: string;
};

export type SyncProgressArgs = {
  web3: Web3;
  account: string;
  signature: string;
  sender: string;
  farmId: number;
  bumpkinId: number;
  deadline: number;
  sessionId: string;
  nextSessionId: string;
  progress: ProgressData;
  fee: string;
  purchase: {
    name: string;
    amount: number;
  };
};

export type MintCollectibleArgs = {
  web3: Web3;
  account: string;
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  // Data
  farmId: number;
  fee: string;
  mintData: {
    mintId: number;
    ingredientIds: number[];
    ingredientAmounts: number[];
    supply: number;
  };
};

export type Recipe = {
  mintId: number;
  cooldownSeconds: number;
  maxSupply: number;
  enabled: boolean;
  tokenAmount?: number;
  ingredientAmounts?: number[];
  ingredientIds?: number[];
  releaseDate?: number;
};

export async function getRecipes(
  web3: Web3,
  account: string,
  ids: number[],
  attempts = 0
): Promise<Recipe[]> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const recipes: Recipe[] = await new web3.eth.Contract(
      GameABI as AbiItem[],
      address as string
    ).methods
      .getRecipeBatch(ids)
      .call({ from: account });

    // Undefined recipes come back with ID 0. Map the provided ID into the recipe.
    const recipesWithIds = recipes.map((recipe, i) => ({
      ...recipe,
      mintId: ids[i],
    }));

    // For UI purposes, do not show the wei values
    const ethBasedRecipes = recipesWithIds.map((recipe) => {
      if (CONFIG.NETWORK === "amoy") {
        return {
          ...recipe,
          cooldownSeconds: Number(recipe.cooldownSeconds),
        };
      }

      const {
        tokenAmount,
        ingredientAmounts = [],
        ingredientIds = [],
      } = recipe;

      return {
        ...recipe,
        tokenAmount: tokenAmount ? Number(fromWei(tokenAmount.toString())) : 0,
        ingredientAmounts: ingredientAmounts.map((amount, index) =>
          Number(
            fromWei(
              amount.toString(),
              getItemUnit(KNOWN_ITEMS[ingredientIds[index]])
            )
          )
        ),
        cooldownSeconds: Number(recipe.cooldownSeconds),
      };
    });

    return ethBasedRecipes;
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getRecipes(web3, account, ids, attempts + 1);
    }

    throw error;
  }
}

export async function getMintedAtBatch(
  web3: Web3,
  farmId: number,
  ids: number[],
  attempts = 0
): Promise<number[]> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const mintedAts: number[] = await new web3.eth.Contract(
      GameABI as AbiItem[],
      address as string
    ).methods
      .getMintedAtBatch(farmId, ids)
      .call();

    return mintedAts;
  } catch (e) {
    const error = parseMetamaskError(e);

    if (attempts < 3) {
      return getMintedAtBatch(web3, farmId, ids, attempts + 1);
    }

    throw error;
  }
}

export async function syncProgress({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  bumpkinId,
  progress,
  fee,
  purchase,
}: SyncProgressArgs): Promise<string> {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(GameABI as AbiItem[], address as string).methods
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
      .send({ from: account, value: fee, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        if (purchase) {
          // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?sjid=11955999175679069053-AP&client_type=gtag#purchase
          onboardingAnalytics.logEvent("purchase", {
            currency: "MATIC",
            // Unique ID to prevent duplicate events
            transaction_id: `${sessionId}-${farmId}`,
            value: Number(fromWei(fee)),
            items: [
              {
                item_id: purchase.name.split(" ").join("_"),
                item_name: purchase.name,
                quantity: purchase.amount,
              },
            ],
          });
        }

        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt = await web3.eth.getTransactionReceipt(transactionHash);

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        resolve(receipt);
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId
  );
  return newSessionId;
}

export async function mint({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  mintId,
  fee,
}: {
  web3: Web3;
  account: string;
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  // Data
  farmId: number;
  mintId: number;
  fee: string;
}): Promise<string> {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(GameABI as AbiItem[], address as string).methods
      .mint(signature, sessionId, nextSessionId, deadline, farmId, mintId, fee)
      .send({ from: account, value: fee, gasPrice })
      .on("error", function (error: any) {
        // eslint-disable-next-line no-console
        console.log({ error });
        const parsed = parseMetamaskError(error);
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        // eslint-disable-next-line no-console
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any = await web3.eth.getTransactionReceipt(
            transactionHash
          );

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        resolve(receipt);
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId
  );
  return newSessionId;
}

export async function mintCollectible({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  fee,
  mintData,
}: MintCollectibleArgs): Promise<string> {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(GameABI as AbiItem[], address as string).methods
      .mintCollectible(
        signature,
        sessionId,
        nextSessionId,
        deadline,
        farmId,
        fee,
        mintData
      )
      .send({ from: account, value: fee, gasPrice })
      .on("error", function (error: any) {
        // eslint-disable-next-line no-console
        console.log({ error });
        const parsed = parseMetamaskError(error);
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        // eslint-disable-next-line no-console
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any = await web3.eth.getTransactionReceipt(
            transactionHash
          );

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        resolve(receipt);
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId
  );
  return newSessionId;
}

export async function listTrade({
  web3,
  account,
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
  web3: Web3;
  account: string;
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
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(GameABI as AbiItem[], address as string).methods
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
      .send({ from: account, value: fee, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        // eslint-disable-next-line no-console
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        // eslint-disable-next-line no-console
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any = await web3.eth.getTransactionReceipt(
            transactionHash
          );

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        // eslint-disable-next-line no-console
        console.log({ receipt });
        resolve(receipt);
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId
  );
  return newSessionId;
}

export async function cancelTrade({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  listingId,
}: {
  web3: Web3;
  account: string;
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  farmId: number;
  listingId: number;
}) {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(GameABI as AbiItem[], address as string).methods
      .cancelTrade(
        signature,
        sessionId,
        nextSessionId,
        deadline,
        farmId,
        listingId
      )
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        // eslint-disable-next-line no-console
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        // eslint-disable-next-line no-console
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any = await web3.eth.getTransactionReceipt(
            transactionHash
          );

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        // eslint-disable-next-line no-console
        console.log({ receipt });
        resolve(receipt);
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId
  );
  return newSessionId;
}

export async function purchaseTrade({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  listingId,
  sfl,
}: {
  web3: Web3;
  account: string;
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  farmId: number;
  listingId: number;
  sfl: number;
}) {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(GameABI as AbiItem[], address as string).methods
      .purchaseTrade(
        signature,
        sessionId,
        nextSessionId,
        deadline,
        farmId,
        listingId,
        sfl
      )
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        // eslint-disable-next-line no-console
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        // eslint-disable-next-line no-console
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any = await web3.eth.getTransactionReceipt(
            transactionHash
          );

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        // eslint-disable-next-line no-console
        console.log({ receipt });
        resolve(receipt);
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId
  );
  return newSessionId;
}
