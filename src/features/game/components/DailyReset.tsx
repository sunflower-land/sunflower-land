import { useContext, useEffect } from "react";
import { Context } from "../GameProvider";
import { useSound } from "lib/utils/hooks/useSound";

interface DailyResetActions {
  triggerReset: () => void;
}

const useDailyResetActions = (): DailyResetActions => {
  const { gameService } = useContext(Context);
  const { play } = useSound("morning_rooster");

  return {
    triggerReset: () => {
      gameService.send("daily.reset");
      gameService.send("SAVE");
      play();
    },
  };
};

export const DailyReset: React.FC = () => {
  const { triggerReset } = useDailyResetActions();

  useEffect(() => {
    // Calculate time until next check
    const getNextCheckTime = () => {
      const now = new Date();

      // In development: check at the start of each minute
      // const nextMinute = new Date(now);
      // nextMinute.setSeconds(0);
      // nextMinute.setMilliseconds(0);
      // nextMinute.setMinutes(nextMinute.getMinutes() + 1);
      // return nextMinute.getTime() - now.getTime();

      // In production: check at UTC midnight
      const tomorrow = new Date(now);
      tomorrow.setUTCHours(24, 0, 0, 0);
      return tomorrow.getTime() - now.getTime();
    };

    const scheduleNextReset = () => {
      const timeUntilCheck = getNextCheckTime();

      return setTimeout(() => {
        triggerReset();
        // Schedule next check
        timeoutId = scheduleNextReset();
      }, timeUntilCheck);
    };

    let timeoutId = scheduleNextReset();

    return () => clearTimeout(timeoutId);
  }, [triggerReset]);

  return null;
};
