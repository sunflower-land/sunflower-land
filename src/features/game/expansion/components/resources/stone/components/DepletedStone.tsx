import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { StoneRockName } from "features/game/types/resources";
import { READONLY_RESOURCE_COMPONENTS } from "features/island/resources/Resource";
import { GameState, TemperateSeasonName } from "features/game/types/game";

interface Props {
  season: TemperateSeasonName;
  island: GameState["island"];
  timeLeft: number;
  name: StoneRockName;
}

const DepletedStoneComponent: React.FC<Props> = ({
  season,
  island,
  timeLeft,
  name,
}) => {
  const { t } = useAppTranslation();
  const [showTimeLeft, setShowTimeLeft] = useState(false);
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
          />
        </div>
      </div>
    </div>
  );
};

export const DepletedStone = React.memo(DepletedStoneComponent);
