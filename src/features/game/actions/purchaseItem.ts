import { syncProgress } from "lib/blockchain/Game";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { PurchasableItems } from "../types/collectibles";

type Request = {
  farmId: number;
  item: PurchasableItems;
  token: string;
  amount?: number;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function purchaseItem(request: Request) {
  const response = await window.fetch(
    `${API_URL}/purchase-item/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
      body: JSON.stringify({
        item: request.item,
        amount: request.amount,
      }),
    },
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.MINT_COLLECTIBLE_SERVER_ERROR);
  }

  const { gameState, farmAddress, ...transaction } = await response.json();

  return {
    gameState,
    farmAddress,
    transaction,
    verified: true,
    item: request.item,
    amount: request.amount,
  };
}

export async function purchaseItemOnChain(request: {
  transaction: any;
  item: PurchasableItems;
  amount?: number;
}) {
  const sessionId = await syncProgress({
    ...request.transaction,
    web3: wallet.web3Provider,
    account: wallet.myAccount,
    purchase: {
      name: request.item,
      amount: request.amount,
    },
  });

  return { sessionId };
}
