import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { READONLY_RESOURCE_COMPONENTS } from "features/island/resources/Resource";
import type { GoldRockName } from "features/game/types/resources";
import type { GameState, TemperateSeasonName } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  season: TemperateSeasonName;
  island: GameState["island"];
  name: GoldRockName;
  timeLeft: number;
  /**
   * Current effective recovery speed from windowed boosts (e.g. Ore Hourglass).
   * > 1 shows a lightning marker + the multiplier in the popover.
   */
  speed?: number;
}

const DepletedGoldComponent: React.FC<Props> = ({
  season,
  island,
  name,
  timeLeft,
  speed,
}) => {
  const { t } = useAppTranslation();
  const [showTimeLeft, setShowTimeLeft] = useState(false);
  const boosted = speed !== undefined && speed > 1;

  const Image = READONLY_RESOURCE_COMPONENTS({
    season,
    island,
  })[name];

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <div className="absolute w-full h-full pointer-events-none">
        <div className="opacity-50">
          <Image />
        </div>
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

export const DepletedGold = React.memo(DepletedGoldComponent);
