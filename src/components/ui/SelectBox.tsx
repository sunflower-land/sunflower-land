import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import selectBoxBL from "assets/ui/select/selectbox_bl.png";
import selectBoxBR from "assets/ui/select/selectbox_br.png";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";

interface Props {
  innerCanvasWidth: number;
}

export const SelectBox = ({ innerCanvasWidth }: Props) => (
  <>
    <img
      id="testing"
      className="absolute pointer-events-none"
      src={selectBoxBL}
      style={{
        top: `${PIXEL_SCALE * innerCanvasWidth}px`,
        left: `${PIXEL_SCALE * 0}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src={selectBoxBR}
      style={{
        top: `${PIXEL_SCALE * innerCanvasWidth}px`,
        left: `${PIXEL_SCALE * innerCanvasWidth}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src={selectBoxTL}
      style={{
        top: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * 0}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
    <img
      className="absolute pointer-events-none"
      src={selectBoxTR}
      style={{
        top: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * innerCanvasWidth}px`,
        width: `${PIXEL_SCALE * 8}px`,
      }}
    />
  </>
);
