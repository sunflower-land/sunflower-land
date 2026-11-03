import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import { ERRORS } from "lib/errors";
import { getMetaBrowserIdentifiers } from "lib/analytics/meta";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
import type { AttributionPayload } from "lib/analytics/attribution";

export type UTM = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;

  // Facebook Ad tracking
  fbp?: string;
  fbc?: string;
};

type Request = {
  token: string;
  transactionId: string;
  referrerId: string | null;
  utm?: UTM;
  /** First / last touch and consent; see lib/analytics/attribution.ts */
  attribution?: AttributionPayload;
  equipment?: BumpkinParts;
};

export async function signUp({
  token,
  transactionId,
  referrerId,
  utm = {},
  attribution,
  equipment,
}: Request) {
  const { fbp, fbc } = getMetaBrowserIdentifiers();

  const response = await fetchWithRetry(`${CONFIG.API_URL}/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
    body: JSON.stringify({
      referrerId: referrerId ?? undefined,
      utm: {
        ...utm,
        fbp: fbp,
        fbc: fbc,
      },
      attribution,
      equipped: equipment ?? undefined,
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
