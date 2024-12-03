import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shopIcon from "assets/icons/shop.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";

export const MarketplaceButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setFromRoute } = useContext(Context);

  const isWorldRoute = location.pathname.includes("/world");

  return (
    <>
      <div
        onClick={() => {
          if (isWorldRoute) {
            // Navigate to base world route with marketplace
            navigate("/world/marketplace/hot");
          } else {
            // Land context remains the same
            navigate("/marketplace/hot");
          }

          setFromRoute(location.pathname);
        }}
        className="relative flex z-50 cursor-pointer hover:img-highlight"
        style={{
          // left: `${PIXEL_SCALE * 3}px`,
          // bottom: `${PIXEL_SCALE * 78}px`,
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 22}px`,
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
