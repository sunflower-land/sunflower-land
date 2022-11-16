import React from "react";

import ocean from "assets/decorations/ocean.png";

import { CONFIG } from "lib/config";

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
        backgroundSize: "200px",
        imageRendering: "pixelated",
      }}
    >
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
