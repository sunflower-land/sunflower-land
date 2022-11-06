import React from "react";

import logo from "assets/brand/logo.png";
import clouds from "assets/brand/clouds.png";
import sunflowers from "assets/brand/sunflower_border.png";
import pumpkin from "assets/crops/pumpkin/crop.png";

import { InnerPanel, Panel } from "components/ui/Panel";

import { CONFIG } from "lib/config";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

const releaseVersion = CONFIG.RELEASE_VERSION as string;

export const Splash: React.FC<{ fadeIn?: boolean }> = ({
  children,
  fadeIn = true,
}) => {
  return (
    <div className="bg-blue-600 w-full h-full flex relative items-center justify-center">
      <div className="relative w-full max-w-xl mb-96 animate-float z-10">
        <img
          src={pumpkin}
          className="absolute w-8 -rotate-[20deg] z-10 -top-5 sm:-left-3 sm:-rotate-[30deg] sm:w-12 sm:-top-7"
        />
        <img src={logo} className="w-full" />
      </div>
      <div
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
      />
      {fadeIn && (
        <img
          className="opacity-0 absolute hidden"
          src={clouds}
          onLoad={(e) => {
            document.getElementById("clouds")?.classList.add("opacity-100");
            console.log("Loaded");
          }}
        />
      )}
      {children && (
        <Modal show={!!children} centered>
          <Panel className="text-shadow">{children}</Panel>
        </Modal>
      )}
      <img src={sunflowers} className="absolute w-full bottom-0" />

      {/* z-index must be 1056 or higher to break out of bootstrap modal */}
      <div
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
      </div>
    </div>
  );
};
