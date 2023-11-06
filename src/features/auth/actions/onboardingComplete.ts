const GUEST_MODE_COMPLETE = "guestModeComplete";

export const getOnboardingComplete = () =>
  localStorage.getItem(GUEST_MODE_COMPLETE);

export const setOnboardingComplete = () =>
  localStorage.setItem(GUEST_MODE_COMPLETE, "true");
