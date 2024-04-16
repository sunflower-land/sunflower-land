import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  token: string;
  transactionId: string;
  referrerId: string | null;
  promoCode: string | null;
};

export async function signUp(request: Request) {
  const response = await window.fetch(`${CONFIG.API_URL}/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Transaction-ID": request.transactionId,
    },
    body: JSON.stringify({
      promoCode: request.promoCode ?? undefined,
      referrerId: request.referrerId ?? undefined,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status == 400) {
    throw new Error(ERRORS.SIGN_UP_FARM_EXISTS_ERROR);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.SIGN_UP_SERVER_ERROR);
  }

  return await response.json();
}
