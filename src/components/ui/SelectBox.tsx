import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  innerCanvasWidth: number;
}

export const SelectBox = ({ innerCanvasWidth }: Props) => (
  <>
    <img
      className="absolute pointer-events-none"
      src="src/assets/ui/halloweenSelectbox_bl.png"
      style={{
        top: `${PIXEL_SCALE * innerCanvasWidth}px`,
        left: `${PIXEL_SCALE * 0}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src="src/assets/ui/halloweenSelectbox_br.png"
      style={{
        top: `${PIXEL_SCALE * innerCanvasWidth}px`,
        left: `${PIXEL_SCALE * innerCanvasWidth}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src="src/assets/ui/halloweenSelectbox_tl.png"
      style={{
        top: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * 0}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src="src/assets/ui/halloweenSelectbox_tr.png"
      style={{
        top: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * innerCanvasWidth}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
  </>
);
