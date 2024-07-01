import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import fullOilReserve from "assets/resources/oil/oil_reserve_full.webp";

interface Props {
  hasDrill: boolean;
  onDrill: () => void;
}

export const RecoveredOilReserve: React.FC<Props> = ({ hasDrill, onDrill }) => {
  const [showDrillWarning, setShowDrillWarning] = useState(false);
  const { t } = useAppTranslation();

  const handleMouseEnter = () => {
    if (!hasDrill) {
      setShowDrillWarning(true);
    }
  };

  const handleMouseLeave = () => {
    if (showDrillWarning) setShowDrillWarning(false);
  };

  return (
    <div
      className={classNames(
        "absolute w-full h-full flex justify-center items-center",
        {
          "cursor-pointer hover:img-highlight": !showDrillWarning,
          "cursor-not-allowed": showDrillWarning,
        },
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={fullOilReserve}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
        }}
        alt="Full oil reserve"
        onClick={onDrill}
      />
      {/* No tool warning */}
      {showDrillWarning && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -12}px`,
          }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="text-xs mx-1 p-1">
              <span>{`${t("craft")} oil drill`}</span>
            </div>
          </InnerPanel>
        </div>
      )}
    </div>
  );
};
