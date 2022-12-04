import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";

import turnOn from "assets/ui/toggle/turn_on.png";
import turnOff from "assets/ui/toggle/turn_off.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const TimersToggle: React.FC = () => {
  const { showProgressBars, toggleProgressBars } = useContext(Context);

  return (
    <div
      id="toggle"
      className="fixed"
      style={{
        width: `${PIXEL_SCALE * 21}px`,
        right: `${PIXEL_SCALE * 3}px`,
        bottom: `${PIXEL_SCALE * 55.1}px`,
      }}
    >
      <label className="flex flex-col items-center cursor-pointer w-full h-full">
        <input
          onChange={toggleProgressBars}
          type="checkbox"
          checked={showProgressBars}
          className="sr-only peer"
        />
        <p className="text-white text-xs mb-2">Timers</p>
        {showProgressBars && (
          <img src={turnOff} alt="show progress bars" className="w-full" />
        )}
        {!showProgressBars && (
          <img src={turnOn} alt="hide progress bars" className="w-full" />
        )}
      </label>
    </div>
  );
};
