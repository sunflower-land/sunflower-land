import {
  withdrawBudsTransaction,
  withdrawItemsTransaction,
  withdrawSFLTransaction,
  withdrawWearablesTransaction,
} from "lib/blockchain/Withdrawals";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

type SFLOptions = {
  farmId: number;
  sessionId: string;
  sfl: number;
  token: string;
  captcha: string;
  transactionId: string;
};

export async function withdrawSFL({
  farmId,
  sessionId,
  sfl,
  token,
  transactionId,
}: SFLOptions) {
  const response = await window.fetch(`${API_URL}/withdraw-sfl/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
    body: JSON.stringify({
      sfl: sfl,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.WITHDRAW_SERVER_ERROR);
  }

  const transaction = await response.json();

  const newSessionId = await withdrawSFLTransaction({
    ...transaction,
    web3: wallet.web3Provider,
    account: wallet.myAccount,
  });

  return { sessionId: newSessionId, verified: true };
}

type ItemsOptions = {
  farmId: number;
  sessionId: string;
  ids: number[];
  amounts: string[];
  token: string;
  captcha: string;
  transactionId: string;
};

export async function withdrawItems({
  farmId,
  sessionId,
  ids,
  amounts,
  token,
  transactionId,
}: ItemsOptions) {
  const response = await window.fetch(`${API_URL}/withdraw-items/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
    body: JSON.stringify({
      ids,
      amounts,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.WITHDRAW_SERVER_ERROR);
  }

  const transaction = await response.json();

  const newSessionId = await withdrawItemsTransaction({
    ...transaction,
    web3: wallet.web3Provider,
    account: wallet.myAccount,
  });

  return { sessionId: newSessionId, verified: true };
}

type WearableOptions = {
  farmId: number;
  sessionId: string;
  ids: number[];
  amounts: number[];
  token: string;
  captcha: string;
  transactionId: string;
};

export async function withdrawWearables({
  farmId,
  ids,
  amounts,
  token,
  transactionId,
}: WearableOptions) {
  const response = await window.fetch(
    `${API_URL}/withdraw-wearables/${farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
        "X-Transaction-ID": transactionId,
      },
      body: JSON.stringify({
        ids,
        amounts,
      }),
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.WITHDRAW_SERVER_ERROR);
  }

  const transaction = await response.json();

  const newSessionId = await withdrawWearablesTransaction({
    ...transaction,
    web3: wallet.web3Provider,
    account: wallet.myAccount,
  });

  return { sessionId: newSessionId, verified: true };
}

type BudOptions = {
  farmId: number;
  budIds: number[];
  transactionId: string;
  token: string;
};

export async function withdrawBuds({
  farmId,
  budIds,
  transactionId,
  token,
}: BudOptions) {
  const response = await window.fetch(`${API_URL}/withdraw-buds/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
    body: JSON.stringify({
      budIds,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.WITHDRAW_SERVER_ERROR);
  }

  const transaction = await response.json();

  const newSessionId = await withdrawBudsTransaction({
    ...transaction,
    web3: wallet.web3Provider,
    account: wallet.myAccount,
  });

  return { sessionId: newSessionId, verified: true };
}
