import React, { useEffect } from "react";

/**
 * Refresh a component at regular intervals.
 * @param props The props:
 * - delay: The interval in milliseconds.
 * - active: Whether the refresh is active or not.
 */
const useUiRefresher = (props?: { delay?: number; active?: boolean }) => {
  const delay = props?.delay ?? 1000;
  const active = props?.active ?? true;

  const [_, setTimer] = React.useState<number>(0);
  const setRecoveryTime = React.useCallback(() => {
    setTimer((count) => count + 1);
  }, []);

  // refresh in regular intervals
  useEffect(() => {
    if (active) {
      setRecoveryTime();
      const interval = window.setInterval(setRecoveryTime, delay);
      return () => window.clearInterval(interval);
    }
  }, [active, setRecoveryTime]);
};

export default useUiRefresher;
