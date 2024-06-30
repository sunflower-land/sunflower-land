import React from "react";

import lunarCalendar from "assets/sfts/lunar_calendar.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const LunarCalendar: React.FC = () => {
  return (
    <>
      <img
        src={lunarCalendar}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute pointer-events-none"
        alt="Lunar Calendar"
      />
    </>
  );
};
