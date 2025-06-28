import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";

export const Splash: React.FC = ({ children }) => {
  return (
    <div
      className="bg-blue-600 w-full bg-repeat h-full flex relative items-center justify-center"
      style={{
        backgroundImage: `url(${SUNNYSIDE.decorations.ocean})`,
        backgroundSize: `${64 * PIXEL_SCALE}px`,
        imageRendering: "pixelated",
      }}
    >
      {/* <img
        src={landing}
        className="absolute left-0 top0"
        style={{ width: `${PIXEL_SCALE * 320}px` }}
      /> */}
      {children && (
        <Modal show={!!children}>
          <Panel>{children}</Panel>
        </Modal>
      )}
    </div>
  );
};
