import { SUNNYSIDE } from "assets/sunnyside";
import React from "react";

import maneki from "assets/sfts/maneki_neko.gif";

import { PIXEL_SCALE } from "../lib/constants";

export const Revealing: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">What could it be?</span>
      <img
        src={maneki}
        alt="digging"
        className="my-2"
        style={{
          width: `${PIXEL_SCALE * 33}px`,
        }}
      />
      <span
        className="text-center text-xs loading mb-2"
        style={{
          height: "24px",
        }}
      >
        Loading
      </span>
    </div>
  );
};
