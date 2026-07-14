import { useContext, useEffect } from "react";
import { Context } from "../GameProvider";

export const DailyReset: React.FC = () => {
  const { gameService } = useContext(Context);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;

    // Only the `playing` state handles DAILY_RESET — if the machine is
    // elsewhere at midnight (autosaving, landscaping, a modal) XState would
    // discard the event, so hold it until the machine returns to `playing`
    const triggerReset = () => {
      subscription?.unsubscribe();

      // The rooster crow is played by DailyResetModal when the state is entered
      if (gameService.getSnapshot().matches("playing")) {
        gameService.send("DAILY_RESET");
        return;
      }

      let delivered = false;
      subscription = gameService.subscribe((state) => {
        if (delivered || !state.matches("playing")) return;

        delivered = true;
        gameService.send("DAILY_RESET");
        subscription?.unsubscribe();
      });
    };

    // Calculate time until next check
    const getNextCheckTime = () => {
      const now = new Date();

      // In development: check at the start of each minute
      // const nextMinute = new Date(now);
      // nextMinute.setSeconds(0);
      // nextMinute.setMilliseconds(0);
      // nextMinute.setMinutes(nextMinute.getMinutes() + 1);
      // return nextMinute.getTime() - now.getTime();

      // In production: check at UTC midnight with 0-5s jitter
      const tomorrow = new Date(now);
      tomorrow.setUTCHours(24, 0, 0, 0);
      const jitter = Math.floor(Math.random() * 5000); // Random 0-5000ms
      return tomorrow.getTime() - now.getTime() + jitter;
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

    return () => {
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, [gameService]);

  return null;
};
