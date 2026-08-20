import {
  ACTIVITY_WINDOW_MS,
  CONTINUOUS_HOURS_REQUIRED,
  HOUR_MS,
  clearCaptchaActivity,
  getContinuousPlayHours,
  isCaptchaRequired,
  logSaveActivity,
  markCaptchaSolved,
} from "./captchaActivity";

// Fixed "now" in the middle of an hour so bucket maths is predictable
const NOW = Math.floor(1_700_000_000_000 / HOUR_MS) * HOUR_MS + HOUR_MS / 2;

/** Logs one save per hour, `hours` hours back-to-back, ending at NOW */
function playContinuouslyFor(hours: number) {
  for (let i = 0; i < hours; i++) {
    logSaveActivity(NOW - i * HOUR_MS);
  }
}

describe("captchaActivity", () => {
  beforeEach(() => {
    clearCaptchaActivity();
  });

  describe("logSaveActivity", () => {
    it("dedupes saves within the same hour", () => {
      logSaveActivity(NOW);
      logSaveActivity(NOW + 1000);
      logSaveActivity(NOW + 2000);

      expect(getContinuousPlayHours(NOW)).toBe(1);
    });

    it("prunes activity older than 24 hours", () => {
      logSaveActivity(NOW - ACTIVITY_WINDOW_MS - HOUR_MS);
      logSaveActivity(NOW);

      const raw = localStorage.getItem("captcha.activityLog");

      expect(JSON.parse(raw as string)).toHaveLength(1);
    });
  });

  describe("getContinuousPlayHours", () => {
    it("is zero with no activity", () => {
      expect(getContinuousPlayHours(NOW)).toBe(0);
    });

    it("counts back-to-back hours", () => {
      playContinuouslyFor(4);

      expect(getContinuousPlayHours(NOW)).toBe(4);
    });

    it("stops counting at a gap", () => {
      logSaveActivity(NOW);
      logSaveActivity(NOW - HOUR_MS);
      // Skipped an hour
      logSaveActivity(NOW - 3 * HOUR_MS);
      logSaveActivity(NOW - 4 * HOUR_MS);

      expect(getContinuousPlayHours(NOW)).toBe(2);
    });

    it("still counts when the current hour has no save yet", () => {
      // Player just crossed an hour boundary - saves exist for the previous
      // hours but not this one
      for (let i = 1; i <= 4; i++) {
        logSaveActivity(NOW - i * HOUR_MS);
      }

      expect(getContinuousPlayHours(NOW)).toBe(4);
    });
  });

  describe("isCaptchaRequired", () => {
    it("is not required before four continuous hours", () => {
      playContinuouslyFor(CONTINUOUS_HOURS_REQUIRED - 1);

      expect(isCaptchaRequired(NOW)).toBe(false);
    });

    it("is required after four continuous hours", () => {
      playContinuouslyFor(CONTINUOUS_HOURS_REQUIRED);

      expect(isCaptchaRequired(NOW)).toBe(true);
    });

    it("is not required again within an hour of solving", () => {
      playContinuouslyFor(CONTINUOUS_HOURS_REQUIRED);
      markCaptchaSolved(NOW);

      expect(isCaptchaRequired(NOW + HOUR_MS / 2)).toBe(false);
    });

    it("is required again after another hour of non-stop play", () => {
      playContinuouslyFor(CONTINUOUS_HOURS_REQUIRED);
      markCaptchaSolved(NOW);

      // An hour later they are still playing
      const later = NOW + HOUR_MS;
      logSaveActivity(later);

      expect(isCaptchaRequired(later)).toBe(true);
    });

    it("resets after the player takes a break", () => {
      playContinuouslyFor(CONTINUOUS_HOURS_REQUIRED);

      // Comes back three hours later
      const later = NOW + 3 * HOUR_MS;
      logSaveActivity(later);

      expect(isCaptchaRequired(later)).toBe(false);
    });
  });
});
