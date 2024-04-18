import React, { useContext, useEffect, useState } from "react";

import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const Timer: React.FC<{ readyAt: number }> = ({ readyAt }) => {
  const [secondsLeft, setSecondsLeft] = useState((readyAt - Date.now()) / 1000);

  const active = readyAt >= Date.now();

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setSecondsLeft((readyAt - Date.now()) / 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [active]);

  return (
    <div className="flex items-center mb-2">
      <img src={SUNNYSIDE.icons.timer} className="h-5 mr-1" />

      <span className="text-xs mr-1">
        {secondsToString(secondsLeft, {
          length: "full",
        })}
      </span>
    </div>
  );
};

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export const CropMachineModal: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  return <></>;
};
