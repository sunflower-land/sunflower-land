import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const host = window.location.host.replace(/^www\./, "");
const REFERRER_LS_KEY = `sb_wiz.ref-key.v.${host}`;

export function saveReferrerId(id: string) {
  localStorage.setItem(REFERRER_LS_KEY, id);
}

export function getReferrerId() {
  return localStorage.getItem(REFERRER_LS_KEY);
}

const SIGN_UP_LS_KEY = `sb_wiz.signup-key.v.${host}`;

type SignupMethod = "paidMint" | "freeMint";
export function saveSignupMethod(id: SignupMethod) {
  localStorage.setItem(SIGN_UP_LS_KEY, id);
}

export function getSignupMethod(): SignupMethod {
  const item = localStorage.getItem(SIGN_UP_LS_KEY) as "paidMint" | "freeMint";

  return item || undefined;
}

export async function checkReferralCode({
  referralCode,
  token,
}: {
  token: string;
  referralCode: string;
}) {
  const response = await window.fetch(`${CONFIG.API_URL}/check-referral-code`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ referralCode }),
  });

  if (response.status === 409) {
    return { success: false };
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  return { success: true };
}
