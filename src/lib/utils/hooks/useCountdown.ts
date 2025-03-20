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
    setCountDown(getTimeRemaining(targetDate));

    const interval = setInterval(() => {
      setCountDown(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return getReturnValues(countDown);
};
