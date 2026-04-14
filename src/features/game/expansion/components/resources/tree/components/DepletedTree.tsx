import React, { useState } from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameState, TemperateSeasonName } from "features/game/types/game";
import { STUMP_VARIANTS } from "features/island/lib/alternateArt";
import { getCurrentBiome, LandBiomeName } from "features/island/biomes/biomes";

interface Props {
  timeLeft: number;
  island: GameState["island"];
  season: TemperateSeasonName;
}

const DepletedTreeComponent: React.FC<Props> = ({
  timeLeft,
  island,
  season,
}) => {
  const [showTimeLeft, setShowTimeLeft] = useState(false);
  const { t } = useAppTranslation();

  const biome: LandBiomeName = getCurrentBiome(island);

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <div className="absolute w-full h-full pointer-events-none">
        <img
          src={STUMP_VARIANTS[biome][season]}
          className="absolute opacity-50"
          style={{
            width: `${GRID_WIDTH_PX}px`,
            bottom: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 8}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full"
          style={{
            top: `${PIXEL_SCALE * -10}px`,
          }}
        >
          <TimeLeftPanel
            text={t("resources.recoversIn")}
            timeLeft={timeLeft}
            showTimeLeft={showTimeLeft}
          />
        </div>
      </div>
    </div>
  );
};

export const DepletedTree = React.memo(DepletedTreeComponent);
