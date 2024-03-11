import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { getSunstoneStage } from "../Sunstone";
import sunstone_1 from "assets/resources/sunstone/sunstone_rock_1.webp";
import sunstone_2 from "assets/resources/sunstone/sunstone_rock_2.webp";
import sunstone_3 from "assets/resources/sunstone/sunstone_rock_3.webp";
import sunstone_4 from "assets/resources/sunstone/sunstone_rock_4.webp";
import sunstone_5 from "assets/resources/sunstone/sunstone_rock_5.webp";
import sunstone_6 from "assets/resources/sunstone/sunstone_rock_6.webp";
import sunstone_7 from "assets/resources/sunstone/sunstone_rock_7.webp";
import sunstone_8 from "assets/resources/sunstone/sunstone_rock_8.webp";
import sunstone_9 from "assets/resources/sunstone/sunstone_rock_9.webp";
import sunstone_10 from "assets/resources/sunstone/sunstone_rock_10.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  timeLeft: number;
  minesLeft: number;
}

const DepletedSunstoneComponent: React.FC<Props> = ({
  timeLeft,
  minesLeft,
}) => {
  const { t } = useAppTranslation();
  const [showTimeLeft, setShowTimeLeft] = useState(false);

  const sunstoneImage = [
    sunstone_1,
    sunstone_2,
    sunstone_3,
    sunstone_4,
    sunstone_5,
    sunstone_6,
    sunstone_7,
    sunstone_8,
    sunstone_9,
    sunstone_10,
  ][getSunstoneStage(minesLeft) - 1];

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <div className="absolute w-full h-full pointer-events-none">
        <img
          src={sunstoneImage}
          className="absolute opacity-50"
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            bottom: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 4}px`,
          }}
        />
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

export const DepletedSunstone = React.memo(DepletedSunstoneComponent);
