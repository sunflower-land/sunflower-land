import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { buySFL as buySFLOnChain } from "lib/blockchain/BuySFL";
import { wallet } from "lib/blockchain/wallet";

const API_URL = CONFIG.API_URL;

type Options = {
  farmId: number;
  token: string;
  transactionId: string;
  matic: string;
  amountOutMin: string;
};

export async function buySFL({
  farmId,
  token,
  transactionId,
  matic,
  amountOutMin,
}: Options) {
  const response = await window.fetch(`${API_URL}/buy-sfl/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.SYNC_SERVER_ERROR);
  }

  const transaction = await response.json();

  // Do contract call
  const receipt = await buySFLOnChain({
    ...transaction,
    account: wallet.getAccount(),
    matic,
    amountOutMin,
  });

  return receipt;
}
