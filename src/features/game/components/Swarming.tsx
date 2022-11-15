import React, { useContext, useEffect, useState } from "react";

import stopwatch from "assets/icons/stopwatch.png";

import goblin1 from "assets/npcs/goblin.gif";
import goblin3 from "assets/npcs/goblin_female.gif";

import { Context } from "../GameProvider";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { getGoblinSwarm } from "../events/detectBot";
import { secondsToString } from "lib/utils/time";

export const Swarming: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const swarmUntil = getGoblinSwarm() as Date;

    const setTime = () => {
      setSecondsLeft((swarmUntil.getTime() - Date.now()) / 1000);
    };

    setTime();

    const interval = setInterval(setTime, 1000);

    return () => clearInterval(interval);
  }, []);
  const onAcknowledge = () => {
    gameService.send("REFRESH");
  };

  return (
    <>
      <>
        <div className="flex flex-col items-center p-1">
          <span className="text-center text-sm sm:text-base">
            Goblin Swarm!
          </span>
          <div className="flex items-end">
            <img src={goblin1} className="h-12" />
            <img
              src={goblin3}
              className="h-16 ml-2"
              style={{
                transform: "scaleX(-1)",
              }}
            />
          </div>
          <p className="text-xs sm:text-sm mb-3 mt-2">
            {`Pay attention, you took too long to farm your crops!`}
          </p>
          <p className="text-xs sm:text-sm mb-1">
            {`The Goblins have taken over your farm. You must wait for them to leave`}
          </p>
        </div>
        {secondsLeft > 0 ? (
          <div className="flex items-center justify-center">
            <img src={stopwatch} className="w-6 mr-2" />
            <span>{secondsToString(secondsLeft, { length: "full" })}</span>
          </div>
        ) : (
          <Button onClick={onAcknowledge}>Continue</Button>
        )}
      </>
    </>
  );
};
