import React, { useContext, useEffect, useState } from "react";

import goblin3 from "assets/npcs/goblin_female.gif";

import { Context } from "../GameProvider";
import { Button } from "components/ui/Button";
import { getGoblinSwarm } from "../events/detectBot";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "../lib/constants";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Swarming: React.FC = () => {
  const { gameService } = useContext(Context);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const { t } = useAppTranslation();

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
  // Translation needed for line 57, 60
  return (
    <>
      <div className="flex flex-col items-center p-2">
        <span className="text-center text-base">{t("goblin.swarm")}</span>
        <div className="flex items-end my-2">
          <img
            src={SUNNYSIDE.npcs.goblin}
            style={{
              width: `${PIXEL_SCALE * 18}px`,
            }}
          />
          <img
            src={goblin3}
            className="ml-2"
            style={{
              transform: "scaleX(-1)",
              width: `${PIXEL_SCALE * 18}px`,
            }}
          />
        </div>
        <p className="text-sm mb-3 mt-2 w-full">
          {`Pay attention, you took too long to farm your crops!`}
        </p>
        <p className="text-sm mb-3 w-full">
          {`The Goblins have taken over your farm. You must wait for them to leave`}
        </p>
        {secondsLeft >= 0 && (
          <div className="flex mt-2">
            <CountdownLabel timeLeft={secondsLeft} />
          </div>
        )}
      </div>
      {secondsLeft < 0 && (
        <Button onClick={onAcknowledge}>{t("continue")}</Button>
      )}
    </>
  );
};
