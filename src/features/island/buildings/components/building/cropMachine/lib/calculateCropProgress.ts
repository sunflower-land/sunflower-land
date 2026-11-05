type Args = {
  totalGrowTime: number;
  startTime?: number;
  /** The caller's clock (a `useNow` value in components — never `Date.now()`). */
  now: number;
  readyAt?: number;
  growsUntil?: number;
  growTimeRemaining: number;
};

export const calculateCropProgress = ({
  totalGrowTime,
  readyAt,
  growsUntil,
  startTime,
  now,
  growTimeRemaining,
}: Args) => {
  if (startTime === undefined || startTime > now) return 0;
  if (readyAt && readyAt <= now) return 100;

  if (readyAt) {
    const timeTillStops = readyAt - now;
    const remainderAfterStops = growTimeRemaining + timeTillStops;

    return Math.min(
      ((totalGrowTime - remainderAfterStops) / totalGrowTime) * 100,
      100,
    );
  }

  if (growsUntil !== undefined) {
    if (now > growsUntil) {
      return Math.min(
        ((totalGrowTime - growTimeRemaining) / totalGrowTime) * 100,
        100,
      );
    }

    const timeTillStops = growsUntil - now;
    const remainderAfterStops = growTimeRemaining + timeTillStops;

    return Math.min(
      ((totalGrowTime - remainderAfterStops) / totalGrowTime) * 100,
      100,
    );
  }

  // Should never reach here
  return 0;
};
