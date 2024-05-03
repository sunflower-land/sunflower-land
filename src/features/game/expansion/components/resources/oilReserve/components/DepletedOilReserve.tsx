import React, { useState } from "react";

import emptyOilReserve from "assets/resources/oil/oil_reserve_empty.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";

interface Props {
  timeLeft: number;
}

export const DepletedOilReserve: React.FC<Props> = ({ timeLeft }) => {
  const { t } = useAppTranslation();
  const [showTimeLeft, setShowTimeLeft] = useState(false);

  return (
    <div
      className="absolute w-full h-full flex justify-center items-center"
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <img
        src={emptyOilReserve}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
        }}
        alt="Full oil reserve"
      />
      <div
        className="flex justify-center absolute w-full"
        style={{
          top: `${PIXEL_SCALE * -12}px`,
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
