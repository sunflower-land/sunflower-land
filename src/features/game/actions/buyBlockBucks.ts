import { buyBlockBucksMATIC } from "lib/blockchain/BuyBlockBucks";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Currency = "USDC" | "MATIC";

type Request = {
  farmId: number;
  token: string;
  type: Currency;
  amount: number;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function buyBlockBucks(request: Request) {
  const response = await window.fetch(
    `${API_URL}/buy-block-bucks/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
      body: JSON.stringify({
        type: request.type,
        amount: request.amount,
      }),
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.MINT_COLLECTIBLE_SERVER_ERROR);
  }

  const transaction = await response.json();

  const blockchainResponse = await buyBlockBucksMATIC({
    ...transaction,
    web3: wallet.web3Provider,
    account: wallet.myAccount,
  });

  console.log(blockchainResponse);

  return { blockchainResponse, verified: true };
}
