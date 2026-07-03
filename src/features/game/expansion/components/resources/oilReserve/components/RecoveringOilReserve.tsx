import React, { useState } from "react";

import halfFullOilReserve from "assets/resources/oil/oil_reserve_half.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  timeLeft: number;
  /**
   * Current effective recovery speed from the windowed Stag Shrine boost.
   * > 1 shows a lightning marker + the multiplier in the popover.
   */
  speed?: number;
}

export const RecoveringOilReserve: React.FC<Props> = ({ timeLeft, speed }) => {
  const { t } = useAppTranslation();
  const [showTimeLeft, setShowTimeLeft] = useState(false);
  const boosted = speed !== undefined && speed > 1;

  return (
    <div
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <img
        src={halfFullOilReserve}
        className="opacity-50"
        style={{
          width: `${PIXEL_SCALE * 30}px`,
        }}
        alt="Full oil reserve"
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
          top: `${PIXEL_SCALE * -16}px`,
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
  );
};
