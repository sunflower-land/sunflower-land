import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

import React from "react";
import { DeliveryLog } from "./DeliveryLog";

export const Deliveries: React.FC = () => {
  return (
    <div>
      <div
        id="deliveries"
        className="fixed flex z-50 justify-center cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 22}px`,
          left: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
        }}
      >
        <img
          src={SUNNYSIDE.ui.round_button}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            height: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <DeliveryLog />
      </div>
    </div>
  );
};
