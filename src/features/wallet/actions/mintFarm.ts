import { createNewAccount } from "lib/blockchain/AccountMinter";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  id: number;
  jwt: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

// Legacy API version - TODO REMOVE
export async function mintFarm(request: Request) {
  const response = await window.fetch(`${API_URL}/mint-farm/${request.id}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Transaction-ID": request.transactionId,
      Authorization: `Bearer ${request.jwt}`,
    },
  });

  if (response.status === 409) {
    throw new Error(ERRORS.WALLET_ALREADY_LINKED);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.LOGIN_SERVER_ERROR);
  }

  await response.json();

  return {};
}

export async function mintNFTFarm(request: Request) {
  const response = await window.fetch(`${API_URL}/mint-account/${request.id}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Transaction-ID": request.transactionId,
      Authorization: `Bearer ${request.jwt}`,
    },
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.MINT_SERVER_ERROR);
  }

  const payload: {
    signature: string;
    deadline: number;
    charity: string;
    fee: string;
    bumpkinWearableIds: number[];
    bumpkinTokenUri: string;
    referrerId: number;
    referrerAmount: number;
  } = await response.json();

  await createNewAccount({
    account: wallet.myAccount as string,
    deadline: payload.deadline,
    fee: payload.fee,
    signature: payload.signature,
    web3: wallet.web3Provider,
  });
}
