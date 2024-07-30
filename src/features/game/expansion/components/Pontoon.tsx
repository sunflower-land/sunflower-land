import React, { useContext, useEffect, useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";

import { ExpansionConstruction } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ProgressBar } from "components/ui/ProgressBar";
import { TimerPopover } from "features/island/common/TimerPopover";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  expansion: ExpansionConstruction;
  onDone: () => void;
}

/**
 * Goblins working hard constructing a piece of land
 */
export const Pontoon: React.FC<Props> = ({ expansion, onDone }) => {
  const { showTimers } = useContext(Context);

  const [showPopover, setShowPopover] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    (expansion.readyAt - Date.now()) / 1000,
  );
  const { t } = useAppTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = (expansion.readyAt - Date.now()) / 1000;
      setSecondsLeft(seconds);

      if (seconds <= 0) {
        clearInterval(interval);
        onDone();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Land is still being built
  const constructionTime = (expansion.readyAt - expansion.createdAt) / 1000;
  return (
    <div
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
      className="w-full h-full"
    >
      <img
        src={SUNNYSIDE.land.pontoon}
        style={{
          top: `${PIXEL_SCALE * 20}px`,
          left: `${PIXEL_SCALE * -10}px`,
          width: `${PIXEL_SCALE * 129}px`,
        }}
        className="relative max-w-none"
      />

      {/* Timer popover */}
      <div
        className="flex justify-center absolute w-full pointer-events-none"
        style={{
          top: `${PIXEL_SCALE * -2}px`,
          left: `${PIXEL_SCALE * 7}px`,
        }}
      >
        <TimerPopover
          image={SUNNYSIDE.land.island}
          description={t("landscape.timerPopover")}
          showPopover={showPopover}
          timeLeft={secondsLeft}
        />
      </div>

      {showTimers && (
        <ProgressBar
          seconds={secondsLeft}
          percentage={
            ((constructionTime - secondsLeft) / constructionTime) * 100
          }
          type="progress"
          formatLength="medium"
          style={{
            top: `${PIXEL_SCALE * 82}px`,
            left: `${PIXEL_SCALE * 45}px`,
          }}
        />
      )}
    </div>
  );
};
