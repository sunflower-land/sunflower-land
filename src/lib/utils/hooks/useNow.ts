import { useEffect, useState } from "react";

/**
 * Hook to use to get Date.now(). Passing live true will make this update each second
 * If you just want to read the time static time once then pass live false.
 * @param live - Whether to live update the time
 * @returns timestamp - millis
 */
export function useNow({ live }: { live?: boolean }) {
  const [time, setTime] = useState(() => Date.now());

  useEffect(() => {
    if (!live) return;

    const id = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return time;
}
