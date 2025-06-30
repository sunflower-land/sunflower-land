import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";

export const Ocean: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [landingImageLoaded, setLandingImageLoaded] = useState(false);

  return (
    <div
      style={{
        width: "100vw", // Full width of the viewport
        height: "100vh", // Full height of the viewport
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#63c74d", // Optional: to visualize the container
        backgroundRepeat: "repeat",

        backgroundImage: `url(${SUNNYSIDE.decorations.ocean})`,
        backgroundSize: `${64 * PIXEL_SCALE}px`,
        imageRendering: "pixelated",

        filter: "brightness(0.7)",
      }}
    >
      {children}

      <img
        src={SUNNYSIDE.brand.water_landing}
        alt="Landing image"
        className={classNames("transition-opacity", {
          "opacity-0": !landingImageLoaded,
          "opacity-100": landingImageLoaded,
        })}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${PIXEL_SCALE * 640}px`,
          maxWidth: "none", // Ensure the image maintains its original size
          maxHeight: "none", // Ensure the image maintains its original size
          transitionDuration: "1s",
        }}
        onLoad={() => setLandingImageLoaded(true)}
      />
    </div>
  );
  // return (
  //   <div
  //     className="bg-blue-600 w-full bg-repeat h-full flex relative items-center justify-center"
  //     style={{
  //       backgroundImage: `url(${SUNNYSIDE.decorations.ocean})`,
  //       backgroundSize: `${64 * PIXEL_SCALE}px`,
  //       imageRendering: "pixelated",
  //     }}
  //   >
  //     {children}
  //   </div>
  // );
};
