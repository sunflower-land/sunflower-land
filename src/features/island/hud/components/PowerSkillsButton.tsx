import React, { useState } from "react";
import lightning from "assets/icons/lightning.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { PowerSkills } from "./PowerSkills";

export const PowerSkillsButton: React.FC = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShow(true);
        }}
        className="relative flex z-50 cursor-pointer hover:img-highlight group"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 22}px`,
        }}
      >
        <img
          src={SUNNYSIDE.ui.round_button_pressed}
          className="absolute group-active:hidden"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            height: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <img
          src={SUNNYSIDE.ui.round_button}
          className="absolute group-active:translate-y-[2px]"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <img
          src={lightning}
          className="absolute group-active:translate-y-[2px]"
          style={{
            top: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 7}px`,
            width: `${PIXEL_SCALE * 8}px`,
          }}
        />
      </div>
      <PowerSkills show={show} onHide={() => setShow(false)} />
    </div>
  );
};
