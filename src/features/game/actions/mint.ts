import { mintCollectible } from "lib/blockchain/Game";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { GoblinBlacksmithItemName } from "../types/collectibles";

type Request = {
  farmId: number;
  sessionId: string;
  item: GoblinBlacksmithItemName;
  token: string;
  captcha: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function mint(request: Request) {
  const response = await window.fetch(
    `${API_URL}/mint-collectible/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
      body: JSON.stringify({
        sessionId: request.sessionId,
        item: request.item,
        captcha: request.captcha,
      }),
    },
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.MINT_COLLECTIBLE_SERVER_ERROR);
  }

  const transaction = await response.json();

  const sessionId = await mintCollectible({
    ...transaction,
    web3: wallet.web3Provider,
    account: wallet.myAccount,
  });

  return { sessionId, verified: true };
}
