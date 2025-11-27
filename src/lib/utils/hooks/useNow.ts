import { useEffect, useRef, useState } from "react";

type UseNowOptions = {
  live?: boolean;
  autoEndAt?: number; // ms since epoch
  intervalMs?: number;
};

/**
 * Hook to get a timestamp.
 * - live = false (default): snapshot at mount
 * - live = true: updates every intervalMs until autoEndAt (if provided)
 */
export function useNow({
  live = false,
  autoEndAt,
  intervalMs = 1000,
}: UseNowOptions = {}) {
  const [time, setTime] = useState(() => Date.now());
  const intervalIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!live) return;

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

  return time;
}
