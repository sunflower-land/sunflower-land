import React, { useState } from "react";
import crimstone_1 from "assets/resources/crimstone/crimstone_rock_1.webp";
import crimstone_2 from "assets/resources/crimstone/crimstone_rock_2.webp";
import crimstone_3 from "assets/resources/crimstone/crimstone_rock_3.webp";
import crimstone_4 from "assets/resources/crimstone/crimstone_rock_4.webp";
import crimstone_5 from "assets/resources/crimstone/crimstone_rock_5.webp";
import crimstone_6 from "assets/resources/crimstone/crimstone_rock_6.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { getCrimstoneStage } from "../getCrimstoneStage";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  timeLeft: number;
  minesLeft: number;
  now: number;
  readyAt: number;
  /**
   * Current effective recovery speed from windowed boosts (e.g. Mole Shrine).
   * > 1 shows a lightning marker + the multiplier in the popover.
   */
  speed?: number;
}

const DepletedCrimstoneComponent: React.FC<Props> = ({
  timeLeft,
  minesLeft,
  speed,
  now,
  readyAt,
}) => {
  const { t } = useAppTranslation();
  const [showTimeLeft, setShowTimeLeft] = useState(false);
  const boosted = speed !== undefined && speed > 1;

  const crimstone = [
    crimstone_1,
    crimstone_2,
    crimstone_3,
    crimstone_4,
    crimstone_5,
    crimstone_6,
  ][getCrimstoneStage(minesLeft, now, readyAt) - 1];

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <div className="absolute w-full h-full pointer-events-none">
        <img
          src={crimstone}
          className="absolute opacity-50"
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            bottom: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 4}px`,
          }}
        />
        {boosted && (
          <img
            src={SUNNYSIDE.icons.lightning}
            alt=""
            aria-hidden
            className="absolute animate-pulse"
            style={{
              width: `${PIXEL_SCALE * 7}px`,
              top: `${PIXEL_SCALE * 2}px`,
              right: `${PIXEL_SCALE * 2}px`,
            }}
          />
        )}
        <div
          className="flex justify-center absolute w-full"
          style={{
            top: `${PIXEL_SCALE * -20}px`,
          }}
        >
          <TimeLeftPanel
            text={t("resources.recoversIn")}
            timeLeft={timeLeft}
            showTimeLeft={showTimeLeft}
            speed={speed}
          />
        </div>
      </div>
    </div>
  );
};

export const DepletedCrimstone = React.memo(DepletedCrimstoneComponent);
