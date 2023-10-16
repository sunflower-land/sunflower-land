import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

import { Codex } from "./Codex";

export const CodexButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
          src={SUNNYSIDE.icons.expression_confused}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${PIXEL_SCALE * 5}px`,
          }}
        />
      </div>

      <Codex show={isOpen} onHide={() => setIsOpen(false)} />
    </>
  );
};
