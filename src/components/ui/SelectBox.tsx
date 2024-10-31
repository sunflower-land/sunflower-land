import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import halloweenSelectboxTL from "assets/ui/halloweenSelectbox_tl.png";
import halloweenSelectboxTR from "assets/ui/halloweenSelectbox_tr.png";
import halloweenSelectboxBL from "assets/ui/halloweenSelectbox_bl.png";
import halloweenSelectboxBR from "assets/ui/halloweenSelectbox_br.png";

interface Props {
  innerCanvasWidth: number;
}

export const SelectBox = ({ innerCanvasWidth }: Props) => (
  <>
    <img
      className="absolute pointer-events-none"
      src={halloweenSelectboxTL}
      style={{
        top: `${PIXEL_SCALE * innerCanvasWidth}px`,
        left: `${PIXEL_SCALE * 0}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src={halloweenSelectboxBR}
      style={{
        top: `${PIXEL_SCALE * innerCanvasWidth}px`,
        left: `${PIXEL_SCALE * innerCanvasWidth}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src={halloweenSelectboxBL}
      style={{
        top: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * 0}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src={halloweenSelectboxTR}
      style={{
        top: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * innerCanvasWidth}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
  </>
);
