import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { makeGame } from "../lib/transforms";
import { GameState } from "../types/game";
import { hasFeatureAccess } from "lib/flags";

const API_URL = CONFIG.API_URL;

type SFLOptions = {
  farmId: number;
  sessionId: string;
  sfl: number;
  token: string;
  captcha: string;
  transactionId: string;
};

export async function withdrawSFLRequest({
  farmId,
  sfl,
  token,
  transactionId,
}: SFLOptions): Promise<{ game: GameState }> {
  if (hasFeatureAccess({} as GameState, "DISABLE_BLOCKCHAIN_ACTIONS")) {
    throw new Error("Withdrawals are disabled");
  }

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

  return {
    game: makeGame(transaction.farm),
  };
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

export async function withdrawItemsRequest({
  farmId,
  ids,
  amounts,
  token,
  transactionId,
}: ItemsOptions): Promise<{ game: GameState }> {
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

  return {
    game: makeGame(transaction.farm),
  };
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

export async function withdrawWearablesRequest({
  farmId,
  ids,
  amounts,
  token,
  transactionId,
}: WearableOptions): Promise<{ game: GameState }> {
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
    },
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.WITHDRAW_SERVER_ERROR);
  }

  const transaction = await response.json();

  return {
    game: makeGame(transaction.farm),
  };
}

type BudOptions = {
  farmId: number;
  budIds: number[];
  transactionId: string;
  token: string;
};

export async function withdrawBudsRequest({
  farmId,
  budIds,
  transactionId,
  token,
}: BudOptions): Promise<{ game: GameState }> {
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

  return {
    game: makeGame(transaction.farm),
  };
}
