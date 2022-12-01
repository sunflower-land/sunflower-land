import { useEffect, useState } from "react";

/**
 * Refresh a component at regular intervals.
 * @param props The props:
 * - delay: The interval in milliseconds.
 * - active: Whether the refresh is active or not.
 */
const useUiRefresher = (props?: { delay?: number; active?: boolean }) => {
  const delay = props?.delay ?? 1000;
  const active = props?.active ?? true;

  const [_, setTimer] = useState<number>(0);

  // refresh in regular intervals
  useEffect(() => {
    if (active) {
      const interval = setInterval(() => setTimer(Date.now()), delay);
      return () => clearInterval(interval);
    }
  }, [active]);
};

export default useUiRefresher;
