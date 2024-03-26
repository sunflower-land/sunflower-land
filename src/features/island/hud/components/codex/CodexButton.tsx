import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

import deliveryAlert from "assets/ui/delivery_alert.png";

import { Codex } from "./Codex";

export const CodexButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="relative flex cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 22}px`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <img
          src={SUNNYSIDE.ui.round_button}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <img
          src={SUNNYSIDE.icons.search}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />

        <div
          className="absolute "
          style={{
            width: `${PIXEL_SCALE * 52}px`,
            left: `${PIXEL_SCALE * 18}px`,
            top: `${PIXEL_SCALE * -6}px`,
          }}
        >
          <img src={deliveryAlert} className="w-full" />
        </div>
      </div>

      <Codex show={isOpen} onHide={() => setIsOpen(false)} />
    </div>
  );
};
