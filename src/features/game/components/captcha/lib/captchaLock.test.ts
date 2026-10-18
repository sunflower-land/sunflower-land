import {
  CAPTCHA_LOCK_MS,
  clearCaptchaLock,
  getCaptchaLockedUntil,
  lockCaptcha,
} from "./captchaLock";

describe("captchaLock", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("is not locked by default", () => {
    expect(getCaptchaLockedUntil()).toBeUndefined();
  });

  it("locks for five minutes", () => {
    const now = Date.now();

    const lockedUntil = lockCaptcha(now);

    expect(lockedUntil).toBe(now + CAPTCHA_LOCK_MS);
    expect(getCaptchaLockedUntil()).toBe(lockedUntil);
  });

  it("persists the lock across reads", () => {
    lockCaptcha();

    expect(getCaptchaLockedUntil()).toBeGreaterThan(Date.now());
  });

  it("clears an expired lock", () => {
    lockCaptcha(Date.now() - CAPTCHA_LOCK_MS * 2);

    expect(getCaptchaLockedUntil()).toBeUndefined();
    expect(localStorage.getItem("captcha.lockedUntil")).toBeNull();
  });

  it("clears a corrupted lock value", () => {
    localStorage.setItem("captcha.lockedUntil", "not-a-number");

    expect(getCaptchaLockedUntil()).toBeUndefined();
  });

  it("removes the lock", () => {
    lockCaptcha();

    clearCaptchaLock();

    expect(getCaptchaLockedUntil()).toBeUndefined();
  });
});
