import { useEffect, useRef, useState } from "react";

type UseNowOptions = {
  live?: boolean;
  autoEndAt?: number; // ms since epoch
  intervalMs?: number;
};

/**
<<<<<<< HEAD
 * Hook to get a timestamp.
 * - live = false (default): snapshot at mount
 * - live = true: updates every intervalMs until autoEndAt (if provided)
 */
export function useNow({
  live = false,
  autoEndAt,
=======
 * Hook to use to get Date.now(). Passing live true will make this update each second or interval of your choice.
 * If you just want to read the time static time once then pass live false.
 * @param live - Whether to live update the time
 * @param intervalMs - The interval in milliseconds to update the time
 * @returns timestamp - millis
 */
type UseNowOptions = {
  live?: boolean;
  intervalMs?: number;
};

export function useNow({
  live = false,
>>>>>>> 1dadf1fc9 ([CHORE] Update more purity issues)
  intervalMs = 1000,
}: UseNowOptions = {}) {
  const [time, setTime] = useState(() => Date.now());
  const intervalIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!live) return;

<<<<<<< HEAD
    const tick = () => {
      setTime(() => {
        const now = Date.now();

        if (autoEndAt !== undefined && now >= autoEndAt) {
          // Stop the interval immediately when end time is reached
          // (cleanup function will also clear if effect re-runs, but null check prevents double-clearing)
          if (intervalIdRef.current !== null) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
          return autoEndAt;
        }

        return now;
      });
    };

    // initial sync
    tick();

    intervalIdRef.current = window.setInterval(tick, intervalMs);

    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [live, intervalMs, autoEndAt]);
=======
    // Sync immediately when we go live
    setTime(Date.now());

    const id = setInterval(() => {
      setTime(Date.now());
    }, intervalMs);

    return () => clearInterval(id);
  }, [live, intervalMs]);
>>>>>>> 1dadf1fc9 ([CHORE] Update more purity issues)

  return time;
}
