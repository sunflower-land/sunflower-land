import { useEffect, useState } from "react";

export const getReturnValues = (timeLeft: number) => {
  // calculate time left
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

const getTimeRemaining = (targetDate: number) => {
  return Math.max(targetDate - Date.now(), 0);
};

export const useCountdown = (targetDate: number) => {
  // Internal tick purely to trigger re-renders; actual time left is derived
  // from `targetDate` and the current time so it updates immediately when
  // `targetDate` changes, without needing to synchronously set state in
  // the effect body.
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      if (remaining <= 0) {
        // Trigger a final render at 0, then stop.
        setTick((tick) => tick + 1);
        clearInterval(interval);
        return;
      }
      setTick((tick) => tick + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timeLeft = getTimeRemaining(targetDate);

  return {
    ...getReturnValues(timeLeft),
    totalSeconds: Math.ceil(timeLeft / 1000),
  };
};
