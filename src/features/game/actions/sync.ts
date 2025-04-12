import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { GameState } from "../types/game";
import { makeGame } from "../lib/transforms";

const API_URL = CONFIG.API_URL;

export type SyncSignatureRequest = {
  farmId: number;
  token: string;
  transactionId: string;
};

export async function sync({
  farmId,
  token,
  transactionId,
}: SyncSignatureRequest): Promise<{ gameState: GameState }> {
  const response = await window.fetch(`${API_URL}/sync-progress/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
    body: JSON.stringify({}),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  const transaction = await response.json();

  if (response.status >= 400) {
    // Custom message was thrown
    if (transaction.errorCode) {
      throw new Error(transaction.errorCode);
    }

    throw new Error(ERRORS.SYNC_SERVER_ERROR);
  }

  // const newSessionId = await syncProgress({
  //   ...transaction,
  //   sender: wallet.getAccount(),
  // });

  // return { verified: true, sessionId: newSessionId };

  return {
    gameState: makeGame(transaction.farm),
  };
}
