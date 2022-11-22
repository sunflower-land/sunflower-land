import React from "react";

import ocean from "assets/decorations/ocean.png";
import sandIslandOne from "assets/brand/sand_island_one.png";
import sandIslandOneShore from "assets/brand/sand_island_one_shore.png";
import sandIslandTwo from "assets/brand/sand_island_two.png";
import sandIslandTwoShore from "assets/brand/sand_island_two_shore.png";
import sunflowerIslandOne from "assets/brand/sunflower_island_one.png";
import watering from "assets/npcs/watering.gif";
import shadow from "assets/npcs/shadow.png";
import swimmer from "assets/npcs/swimmer.gif";
import cossies from "assets/decorations/cossies.png";
import goblinSwimming from "assets/npcs/goblin_farting.gif";

import { CONFIG } from "lib/config";
import { PIXEL_SCALE } from "features/game/lib/constants";

const releaseVersion = CONFIG.RELEASE_VERSION as string;

export const Splash: React.FC<{ fadeIn?: boolean }> = ({
  children,
  fadeIn = true,
}) => {
  return (
    <div
      className="bg-blue-600 w-full bg-repeat h-full flex relative items-center justify-center"
      style={{
        backgroundImage: `url(${ocean})`,
        backgroundSize: `${64 * PIXEL_SCALE}px`,
        imageRendering: "pixelated",
      }}
    >
      <img
        src={sunflowerIslandOne}
        style={{
          width: `${144 * PIXEL_SCALE}px`,
          top: 0,
        }}
        className="absolute"
      />
      <img
        src={goblinSwimming}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          transform: "scaleX(-1)",
          bottom: `${40 * PIXEL_SCALE}px`,
          right: `${45 * PIXEL_SCALE}px`,
        }}
      />
      <img
        src={swimmer}
        style={{
          width: `${16 * PIXEL_SCALE}px`,
          left: `${40 * PIXEL_SCALE}px`,
          bottom: `${80 * PIXEL_SCALE}px`,
        }}
        className="absolute"
      />
      <img
        src={cossies}
        style={{
          width: `${16 * PIXEL_SCALE}px`,
          left: `${20 * PIXEL_SCALE}px`,
          bottom: `${80 * PIXEL_SCALE}px`,
        }}
        className="absolute"
      />
      <img
        src={sandIslandOneShore}
        style={{
          width: `${87 * PIXEL_SCALE}px`,
          left: 0,
          bottom: 0,
        }}
        className="absolute"
      />
      <img
        src={sandIslandTwoShore}
        style={{
          width: `${71 * PIXEL_SCALE}px`,
          right: 0,
          bottom: 0,
        }}
        className="absolute"
      />
      <img
        src={sandIslandOne}
        style={{
          width: `${87 * PIXEL_SCALE}px`,
          left: 0,
          bottom: 0,
        }}
        className="absolute"
      />
      <img
        src={sandIslandTwo}
        style={{
          width: `${71 * PIXEL_SCALE}px`,
          right: 0,
          bottom: 0,
        }}
        className="absolute"
      />
      <img
        src={watering}
        style={{
          width: `${33 * PIXEL_SCALE}px`,
          top: `${10 * PIXEL_SCALE}px`,
          bottom: 0,
          marginLeft: "168px",
        }}
        className="absolute"
      />
      <img
        src={shadow}
        style={{
          width: `${15 * PIXEL_SCALE}px`,
          top: `${22 * PIXEL_SCALE}px`,
          bottom: 0,
          marginLeft: "138px",
        }}
        className="absolute"
      />
      {/* <div className="absolute top-6 w-full max-w-xl animate-float z-10">
        <img src={logo} className="w-2/3" />
      </div> */}
      {/* <div
        className={classNames(
          "bg-repeat w-full h-full absolute inset-0 duration-1000",
          { "opacity-0": fadeIn, "transition-opacity": fadeIn }
        )}
        id="clouds"
        style={{
          backgroundImage: `url(${clouds})`,
          backgroundSize: `70rem 29.4rem`,
          imageRendering: "pixelated",
        }}
      /> */}
      {/* {fadeIn && (
        <img
          className="opacity-0 absolute hidden"
          src={clouds}
          onLoad={(e) => {
            document.getElementById("clouds")?.classList.add("opacity-100");
          }}
        />
      )} */}
      {/* {children && (
        <Modal show={!!children} centered>
          <Panel className="text-shadow">{children}</Panel>
        </Modal>
      )} */}
      {/* <img src={sunflowers} className="absolute w-full bottom-0" /> */}

      {/* z-index must be 1056 or higher to break out of bootstrap modal */}
      {/* <div
        className="absolute bottom-0 right-0 m-1 pointer-events-auto"
        style={{ zIndex: 1100 }}
      >
        <InnerPanel>
          <p className="text-xs sm:text-sm text-shadow text-white p-1">
            <a
              className="underline"
              href="https://github.com/sunflower-land/sunflower-land/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              {releaseVersion?.split("-")[0]}
            </a>
          </p>
        </InnerPanel>
      </div> */}
    </div>
  );
};
