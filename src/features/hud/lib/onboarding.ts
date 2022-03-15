const LOCAL_STORAGE_KEY = "onboarded_at";

export function hasOnboarded() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

export function finishOnboarding() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toISOString());
}
