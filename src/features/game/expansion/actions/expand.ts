import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

type Request = {
  farmId: number;
  token: string;
};

export async function expandRequest(request: Request) {
  // Call backend expand-land
  const response = await window.fetch(
    `${API_URL}/expand-land/${request.farmId}`,
    {
      method: "POST",
      //mode: "no-cors",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        accept: "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error("Could not expand land");
  }

  const data = await response.json();

  return data;
}

export async function expand(request: Request) {
  const response = await expandRequest(request);

  return await wallet.getSessionManager().syncProgress(response);
}
