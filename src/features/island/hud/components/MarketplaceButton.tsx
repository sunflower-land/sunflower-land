import React from "react";
import { useNavigate } from "react-router-dom";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shopIcon from "assets/icons/shop.png";
import { SUNNYSIDE } from "assets/sunnyside";

export const MarketplaceButton = ({
  currentPlayerPosition,
}: {
  currentPlayerPosition: { x: number; y: number };
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        onClick={() => {
          navigate("/marketplace/hot", {
            state: {
              currentPlayerPosition,
            },
          });
        }}
        className="absolute flex z-50 cursor-pointer hover:img-highlight"
        style={{
          left: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 78}px`,
          width: `${PIXEL_SCALE * 22}px`,
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
          src={shopIcon}
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 2.6}px`,
            left: `${PIXEL_SCALE * 4.3}px`,
            width: `${PIXEL_SCALE * 13.5}px`,
          }}
        />
      </div>
    </>
  );
};
