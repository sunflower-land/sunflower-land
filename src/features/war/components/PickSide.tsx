import React from "react";

import humanBanner from "assets/nfts/human_banner.png";
import goblinBanner from "assets/nfts/goblin_banner.png";
import firelighter from "assets/quest/firelighter.gif";

import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  isOpen: boolean;
}
export const PickSide: React.FC<Props> = ({ isOpen }) => {
  return (
    <>
      <div
        className={classNames(
          "fixed inset-0 z-50 opacity-0 transition-opacity pointer-events-none",
          { ["opacity-100 pointer-events-auto"]: isOpen }
        )}
      >
        <div className="absolute inset-0 bg-black opacity-90" />
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="flex flex-col max-w-3xl">
            <div className="flex justify-evenly">
              <img
                src={humanBanner}
                className="animate-float cursor-pointer"
                style={{
                  width: `${14 * PIXEL_SCALE}px`,
                  filter: "drop-shadow(0px 0px 8px rgba(255,249,78,0.69))",
                }}
              />
              <img
                src={goblinBanner}
                className="animate-float cursor-pointer"
                style={{
                  width: `${14 * PIXEL_SCALE * 2}px`,
                  filter: "drop-shadow(0px 0px 8px rgba(255 ,79,79,0.69))",
                }}
              />
            </div>
            <div className="flex justify-between">
              <img
                src={firelighter}
                className="cave"
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
                }}
              />
              <img
                src={firelighter}
                className="cave"
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
                }}
              />
            </div>
            <span className="text-xl text-shadow text-white text-center">
              Choose a side
            </span>
            <span className="text-xl text-shadow text-white text-center">
              Team Sunflower or Team Goblin?
            </span>
            <span className="cave text-xl text-shadow text-white text-center">
              GET READY FOR WAR
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
