const ACTIVITY_KEY = "captcha.activityLog";
const SOLVED_KEY = "captcha.solvedAt";

export const HOUR_MS = 60 * 60 * 1000;

/** Activity older than this is pruned from the log */
export const ACTIVITY_WINDOW_MS = 24 * HOUR_MS;

/** Hours of back-to-back play before a captcha shows up */
export const CONTINUOUS_HOURS_REQUIRED = 4;

/** A solve exempts the player until another full hour of play passes */
export const SOLVE_COOLDOWN_MS = HOUR_MS;

function hourBucket(time: number): number {
  return Math.floor(time / HOUR_MS) * HOUR_MS;
}

/** Hour-bucket start timestamps with activity, covering the last 24 hours. */
export function getActivityLog(now = Date.now()): number[] {
  try {
    const value = localStorage.getItem(ACTIVITY_KEY);

    if (!value) return [];

    const log = JSON.parse(value);

    if (!Array.isArray(log)) return [];

    return log
      .filter((entry) => typeof entry === "number")
      .filter((entry) => entry > now - ACTIVITY_WINDOW_MS);
  } catch {
    return [];
  }
}

/**
 * Records that the player hit the save endpoint. Stored as deduped hour
 * buckets, so the log holds at most 24 entries.
 */
export function logSaveActivity(now = Date.now()) {
  const bucket = hourBucket(now);
  const log = getActivityLog(now);

  if (log.includes(bucket)) return;

  localStorage.setItem(ACTIVITY_KEY, JSON.stringify([...log, bucket]));
}

/**
 * How many back-to-back hours the player has been active for, counting
 * backwards from now. The current hour counts even without a log entry yet -
 * the player is interacting right now.
 */
export function getContinuousPlayHours(now = Date.now()): number {
  const buckets = new Set(getActivityLog(now));
  const current = hourBucket(now);

  let streak = 0;

  // Skip the current hour if its save hasn't landed yet
  let cursor = buckets.has(current) ? current : current - HOUR_MS;

  while (buckets.has(cursor)) {
    streak++;
    cursor -= HOUR_MS;
  }

  return streak;
}

export function getCaptchaSolvedAt(): number {
  const value = Number(localStorage.getItem(SOLVED_KEY));

  return isNaN(value) ? 0 : value;
}

export function markCaptchaSolved(now = Date.now()) {
  localStorage.setItem(SOLVED_KEY, String(now));
}

/**
 * The captcha gate: after CONTINUOUS_HOURS_REQUIRED hours of back-to-back
 * play, a captcha shows up - and keeps showing up once per further hour of
 * non-stop play (the solve cooldown expires as the streak keeps growing).
 */
export function isCaptchaRequired(now = Date.now()): boolean {
  if (getContinuousPlayHours(now) < CONTINUOUS_HOURS_REQUIRED) return false;

  return getCaptchaSolvedAt() <= now - SOLVE_COOLDOWN_MS;
}

/** Test helper */
export function clearCaptchaActivity() {
  localStorage.removeItem(ACTIVITY_KEY);
  localStorage.removeItem(SOLVED_KEY);
}
