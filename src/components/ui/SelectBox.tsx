import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  innerCanvasWidth: number;
}

export const SelectBox = ({ innerCanvasWidth }: Props) => (
  <>
    <img
      className="absolute pointer-events-none"
      src={SUNNYSIDE.ui.selectBoxBL}
      style={{
        top: `${PIXEL_SCALE * innerCanvasWidth}px`,
        left: `${PIXEL_SCALE * 0}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src={SUNNYSIDE.ui.selectBoxBR}
      style={{
        top: `${PIXEL_SCALE * innerCanvasWidth}px`,
        left: `${PIXEL_SCALE * innerCanvasWidth}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src={SUNNYSIDE.ui.selectBoxTL}
      style={{
        top: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * 0}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src={SUNNYSIDE.ui.selectBoxTR}
      style={{
        top: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * innerCanvasWidth}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
  </>
);
