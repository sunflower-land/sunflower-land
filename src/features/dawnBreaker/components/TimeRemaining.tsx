import { CountdownLabel } from "components/ui/CountdownLabel";
import React, { useEffect, useState } from "react";

export const TimeRemaining: React.FC<{ endAt: number }> = ({ endAt }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(
    (endAt - Date.now()) / 1000
  );
  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = (endAt - Date.now()) / 1000;
      setSecondsLeft(seconds);

      if (seconds <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center mb-1">
      <CountdownLabel timeLeft={secondsLeft} endText="remaining" />
    </div>
  );
};
