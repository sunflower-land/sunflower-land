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

export type LandExpansionData = {
  nonce: string;
  metadata: string;
  sfl: string;
  resourceIds: number[];
  resourceAmounts: string[];
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
  expansion: LandExpansionData;
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

export async function getSessionId(
  web3: Web3,
  account: string,
  farmId: number,
  attempts = 0
): Promise<string> {
  const contract = new web3.eth.Contract(
    SessionABI as AbiItem[],
    address as string
  );

  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const sessionId = await contract.methods
      .getSessionId(farmId)
      .call({ from: account });

    return sessionId;
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return getSessionId(web3, account, farmId, attempts + 1);
    }

    throw error;
  }
}

/**
 * Poll until data is ready
 */
export async function getNextSessionId(
  web3: Web3,
  account: string,
  farmId: number,
  oldSessionId: string
): Promise<string> {
  await new Promise((res) => setTimeout(res, 3000));

  const sessionId = await getSessionId(web3, account, farmId);

  // Try again
  if (sessionId === oldSessionId) {
    return getNextSessionId(web3, account, farmId, oldSessionId);
  }

  return sessionId;
}

export async function getRecipes(
  web3: Web3,
  account: string,
  ids: number[],
  attempts = 0
): Promise<Recipe[]> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const contract = new web3.eth.Contract(
      SessionABI as AbiItem[],
      address as string
    );
    const recipes: Recipe[] = await new web3.eth.Contract(
      SessionABI as AbiItem[],
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
      if (CONFIG.NETWORK === "mumbai") {
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
  account: string,
  farmId: number,
  ids: number[],
  attempts = 0
): Promise<number[]> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const mintedAts: number[] = await new web3.eth.Contract(
      SessionABI as AbiItem[],
      address as string
    ).methods
      .getMintedAtBatch(farmId, ids)
      .call({ from: account });

    return mintedAts;
  } catch (e) {
    const error = parseMetamaskError(e);

    if (attempts < 3) {
      return getMintedAtBatch(web3, account, farmId, ids, attempts + 1);
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
  expansion,
}: SyncProgressArgs): Promise<string> {
  const oldSessionId = await getSessionId(web3, account, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(SessionABI as AbiItem[], address as string).methods
      .syncProgress({
        signature,
        farmId,
        bumpkinId,
        deadline,
        sessionId,
        nextSessionId,
        progress,
        expansion,
        fee,
      })
      .send({ from: account, value: fee, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
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
  const oldSessionId = await getSessionId(web3, account, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(SessionABI as AbiItem[], address as string).methods
      .mint(signature, sessionId, nextSessionId, deadline, farmId, mintId, fee)
      .send({ from: account, value: fee, gasPrice })
      .on("error", function (error: any) {
        console.log({ error });
        const parsed = parseMetamaskError(error);
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
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
  const oldSessionId = await getSessionId(web3, account, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(SessionABI as AbiItem[], address as string).methods
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
        console.log({ error });
        const parsed = parseMetamaskError(error);
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
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

export async function withdrawItems({
  web3,
  account,
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
  web3: Web3;
  account: string;
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
  const oldSessionId = await getSessionId(web3, account, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(SessionABI as AbiItem[], address as string).methods
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
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
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
  const oldSessionId = await getSessionId(web3, account, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(SessionABI as AbiItem[], address as string).methods
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
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
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
  const oldSessionId = await getSessionId(web3, account, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(SessionABI as AbiItem[], address as string).methods
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
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
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
  const oldSessionId = await getSessionId(web3, account, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(SessionABI as AbiItem[], address as string).methods
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
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
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

export async function expandLand({
  web3,
  account,
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
  web3: Web3;
  account: string;
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
  const oldSessionId = await getSessionId(web3, account, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    new web3.eth.Contract(SessionABI as AbiItem[], address as string).methods
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
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        console.log({ parsedIt: parsed });
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
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
