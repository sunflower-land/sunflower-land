import React, { useContext, useEffect, useState } from "react";
import minting from "assets/npcs/minting.gif";
import { secondsToLongString } from "lib/utils/time";
import * as AuthProvider from "features/auth/lib/Provider";

/**
 * HACK: Small component that pauses the user before proceeding
 * It lessens the load during high critical usage times
 */
export const Countdown: React.FC = () => {
  const [time, setTime] = useState("60secs");
  const { authService } = useContext(AuthProvider.Context);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const timeLeft = 60 - (Date.now() - start) / 1000;
      setTime(secondsToLongString(timeLeft));

      if (timeLeft <= 0) {
        authService.send("REFRESH");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">Your farm has been minted!</span>
      <img src={minting} className="w-1/2 mt-2" />
      <span className="text-xs text-center mb-1">
        Your farm will be ready in
      </span>
      <span className="text-3xl">{time}</span>
      <span className="text-xs text-center mt-4 underline mb-1">
        Do not refresh this browser
      </span>
    </div>
  );
};
