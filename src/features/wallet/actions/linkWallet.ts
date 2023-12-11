import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  linkedWallet: string;
  signature: string;
  id: number;
  jwt: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function linkWallet(request: Request) {
  const response = await window.fetch(`${API_URL}/link-wallet/${request.id}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Transaction-ID": request.transactionId,
      Authorization: `Bearer ${request.jwt}`,
    },
    body: JSON.stringify({
      linkedWallet: request.linkedWallet,
      signature: request.signature,
    }),
  });

  if (response.status === 409) {
    throw new Error(ERRORS.WALLET_ALREADY_LINKED);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.LOGIN_SERVER_ERROR);
  }

  const { token } = await response.json();

  return { token };
}
