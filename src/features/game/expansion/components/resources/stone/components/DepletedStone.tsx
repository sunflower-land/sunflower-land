import React, { useState, useCallback } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { RockName } from "features/game/types/resources";
import { READONLY_RESOURCE_COMPONENTS } from "features/island/resources/Resource";

interface Props {
  timeLeft: number;
  name: RockName;
}

const DepletedStoneComponent: React.FC<Props> = ({ timeLeft, name }) => {
  const { t } = useAppTranslation();
  const [showTimeLeft, setShowTimeLeft] = useState(false);
  const Image = READONLY_RESOURCE_COMPONENTS()[name];

  const handleShowTimeLeft = useCallback(() => {
    setShowTimeLeft(true);
  }, []);

  const handleHideTimeLeft = useCallback(() => {
    setShowTimeLeft(false);
  }, []);

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={handleShowTimeLeft}
      onMouseLeave={handleHideTimeLeft}
      onTouchStart={handleShowTimeLeft}
      onTouchEnd={handleHideTimeLeft}
      onTouchCancel={handleHideTimeLeft}
    >
      <div className="absolute w-full h-full pointer-events-none">
        <Image className="opacity-50" />
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
