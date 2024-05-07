import React, { useState } from "react";

import halfFullOilReserve from "assets/resources/oil/oil_reserve_half.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  timeLeft: number;
}

export const RecoveringOilReserve: React.FC<Props> = ({ timeLeft }) => {
  const { t } = useAppTranslation();
  const [showTimeLeft, setShowTimeLeft] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <img
        src={halfFullOilReserve}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
        }}
        alt="Full oil reserve"
      />
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
        />
      </div>
    </div>
  );
};
