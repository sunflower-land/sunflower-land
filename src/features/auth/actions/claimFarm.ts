import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import { ERRORS } from "lib/errors";

type Request = {
  token: string;
  transactionId: string;
  farmId: number;
};

export async function claimFarm(request: Request) {
  const response = await fetchWithRetry(
    `${CONFIG.API_URL}/claim-farm/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
    },
  );
  const { errorCode, ...payload } = await response.json();

  if (response.status === 429) {
    throw new Error(errorCode ?? ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(errorCode ?? ERRORS.CLAIM_FARM_SERVER_ERROR);
  }

  return payload;
}
