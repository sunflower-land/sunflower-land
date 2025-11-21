import { useState } from "react";

/**
 * A hook that returns the current epoch timestamp at time of mount
 * @returns The current time in milliseconds
 */
export const useMountedNow = (): number => {
  const [now] = useState(() => Date.now());

  return now;
};
