import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";

import trophy from "assets/icons/trophy.png";

export const LeaderboardButton: React.FC<{
  loaded: boolean;
  onClick?: () => void;
}> = ({ loaded = false, onClick }) => {
  return (
    <div
      onClick={loaded ? onClick : undefined}
      className={classNames("relative", {
        "cursor-pointer hover:img-highlight": loaded,
      })}
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        height: `${PIXEL_SCALE * 22}px`,
      }}
    >
      <img
        src={SUNNYSIDE.ui.round_button}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          transition: "opacity 0.5s",
        }}
      />
      <img
        src={trophy}
        className={classNames("absolute", {
          "opacity-100": loaded,
          "opacity-40": !loaded,
        })}
        style={{
          width: `${PIXEL_SCALE * 13.3}px`,
          top: `${PIXEL_SCALE * 5.6}px`,
          left: `${PIXEL_SCALE * 4.3}px`,
          transition: "opacity 0.5s",
        }}
      />
    </div>
  );
};
