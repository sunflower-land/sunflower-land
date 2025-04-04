import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { makeGame } from "../lib/transforms";
import { GameState } from "../types/game";
import { hasFeatureAccess } from "lib/flags";
import { INITIAL_FARM } from "../lib/constants";

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
}: SFLOptions): Promise<{ gameState: GameState }> {
  if (hasFeatureAccess(INITIAL_FARM, "DISABLE_BLOCKCHAIN_ACTIONS")) {
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
    gameState: makeGame(transaction.farm),
  };
}
