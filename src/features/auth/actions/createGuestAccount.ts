import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;
export const GUEST_KEY = "guestKey";
export const GUEST_MODE_COMPLETE = "guestModeComplete";

export interface Request {
  transactionId: string;
}

export async function createGuestAccount(request: Request) {
  const response = await window.fetch(`${API_URL}/create-guest-account`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Transaction-ID": request.transactionId,
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.CREATE_ACCOUNT_SERVER_ERROR);
  }

  const { guestKey } = await response.json();

  return guestKey;
}

export const getGuestKey = () => localStorage.getItem(GUEST_KEY);
export const setGuestKey = (guestKey: string) =>
  localStorage.setItem(GUEST_KEY, guestKey);
export const removeGuestKey = () => localStorage.removeItem(GUEST_KEY);

export const getOnboardingComplete = () =>
  localStorage.getItem(GUEST_MODE_COMPLETE);

export const setOnboardingComplete = () =>
  localStorage.setItem(GUEST_MODE_COMPLETE, "true");
