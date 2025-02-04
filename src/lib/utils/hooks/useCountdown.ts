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

export const useCountdown = (targetDate: number) => {
  const timeRemaining = Math.max(targetDate - Date.now(), 0);

  const [countDown, setCountDown] = useState<number>(timeRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(timeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  useEffect(() => {
    setCountDown(timeRemaining);
  }, [timeRemaining]);

  return getReturnValues(countDown);
};
