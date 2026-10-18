const LOCAL_STORAGE_KEY = "captcha.lockedUntil";

export const CAPTCHA_LOCK_MS = 5 * 60 * 1000;

/**
 * Returns the timestamp the captcha lock expires at, or undefined if the
 * player is not locked. Expired locks are cleaned up as a side effect.
 */
export function getCaptchaLockedUntil(): number | undefined {
  const value = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!value) return undefined;

  const lockedUntil = Number(value);

  if (isNaN(lockedUntil) || lockedUntil <= Date.now()) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return undefined;
  }

  return lockedUntil;
}

export function lockCaptcha(now = Date.now()): number {
  const lockedUntil = now + CAPTCHA_LOCK_MS;

  localStorage.setItem(LOCAL_STORAGE_KEY, String(lockedUntil));

  return lockedUntil;
}

export function clearCaptchaLock() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}
