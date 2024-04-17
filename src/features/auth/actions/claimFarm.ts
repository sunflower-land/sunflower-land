import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  token: string;
  transactionId: string;
  farmId: number;
};

export async function claimFarm(request: Request) {
  const response = await window.fetch(
    `${CONFIG.API_URL}/claim-farm/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.CLAIM_FARM_SERVER_ERROR);
  }

  return await response.json();
}
