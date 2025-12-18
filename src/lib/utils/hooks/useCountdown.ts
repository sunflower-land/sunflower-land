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

const getTimeRemaining = (targetDate?: number | null) => {
  if (!targetDate) return 0;

  return Math.max(targetDate - Date.now(), 0);
};

export const useCountdown = (targetDate?: number | null) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      const remaining = getTimeRemaining(targetDate);
      setTimeLeft(remaining);

      if (remaining <= 0 && intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    };

    tick();

    intervalId = setInterval(tick, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [targetDate]);

  return {
    ...getReturnValues(timeLeft),
    totalSeconds: Math.ceil(timeLeft / 1000),
  };
};
