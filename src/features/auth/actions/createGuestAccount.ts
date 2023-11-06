const GUEST_KEY = "guestKey";
const GUEST_MODE_COMPLETE = "guestModeComplete";

export interface Request {
  transactionId: string;
}

export const removeGuestKey = () => localStorage.removeItem(GUEST_KEY);

export const getOnboardingComplete = () =>
  localStorage.getItem(GUEST_MODE_COMPLETE);

export const setOnboardingComplete = () =>
  localStorage.setItem(GUEST_MODE_COMPLETE, "true");
