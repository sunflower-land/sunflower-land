import { withdrawItems } from "lib/blockchain/Sessions";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

type Options = {
  farmId: number;
  sessionId: string;
  sfl: number;
  ids: number[];
  amounts: string[];
  token: string;
  captcha: string;
  transactionId: string;
};
export async function withdraw({
  farmId,
  sessionId,
  sfl,
  ids,
  amounts,
  token,
  captcha,
  transactionId,
}: Options) {
  const response = await window.fetch(`${API_URL}/withdraw/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
    body: JSON.stringify({
      sessionId: sessionId,
      sfl: sfl,
      ids: ids,
      amounts: amounts,
      captcha,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.WITHDRAW_SERVER_ERROR);
  }

  const transaction = await response.json();

  const newSessionId = await withdrawItems({
    ...transaction,
    web3: wallet.web3Provider,
    account: wallet.myAccount,
  });

  return { sessionId: newSessionId, verified: true };
}
