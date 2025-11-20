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
  const [countDown, setCountDown] = useState<number>(
    getTimeRemaining(targetDate),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      setCountDown(remaining);

      // Stop interval when countdown reaches 0
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => interval && clearInterval(interval);
  }, [targetDate]);

  return {
    ...getReturnValues(countDown),
    totalSeconds: Math.ceil(countDown / 1000),
  };
};
