import { useEffect, useState } from "react";

/**
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
  intervalMs = 1000,
}: UseNowOptions = {}) {
  const [time, setTime] = useState(() => Date.now());

  useEffect(() => {
    if (!live) return;

    // Sync immediately when we go live
    setTime(Date.now());

    const id = setInterval(() => {
      setTime(Date.now());
    }, intervalMs);

    return () => clearInterval(id);
  }, [live, intervalMs]);

  return time;
}
