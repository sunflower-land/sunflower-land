import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

export type UTM = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

type Request = {
  token: string;
  transactionId: string;
  referrerId: string | null;
  utm?: UTM;
};

export async function signUp({
  token,
  transactionId,
  referrerId,
  utm,
}: Request) {
  const response = await window.fetch(`${CONFIG.API_URL}/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
    body: JSON.stringify({
      referrerId: referrerId ?? undefined,
      utm: utm ?? undefined,
    }),
  });

  const { errorCode, ...payload } = await response.json();

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status == 400) {
    throw new Error(errorCode ?? ERRORS.SIGN_UP_FARM_EXISTS_ERROR);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.SIGN_UP_SERVER_ERROR);
  }

  return payload;
}
