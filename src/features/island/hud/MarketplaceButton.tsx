import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useNavigate } from "react-router";

import shopIcon from "assets/icons/shop.png";

export const MarketplaceButton: React.FC<{ onClick?: () => void }> = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate("/marketplace/hot");
      }}
      className="cursor-pointer hover:img-highlight group"
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        height: `${PIXEL_SCALE * 22}px`,
      }}
    >
      <img
        src={SUNNYSIDE.ui.round_button_pressed}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 22}px`,
        }}
      />
      <img
        src={SUNNYSIDE.ui.round_button}
        className="absolute group-active:hidden"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 22}px`,
        }}
      />
      <img
        src={shopIcon}
        className="absolute group-active:translate-y-[2px]"
        style={{
          top: `${PIXEL_SCALE * 2.6}px`,
          left: `${PIXEL_SCALE * 4.3}px`,
          width: `${PIXEL_SCALE * 13.5}px`,
        }}
      />
    </div>
  );
};
