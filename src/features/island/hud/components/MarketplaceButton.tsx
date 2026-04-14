import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { PIXEL_SCALE } from "features/game/lib/constants";
import tradeIcon from "assets/icons/trade.png";
import { Context } from "features/game/GameProvider";
import { RoundButton } from "components/ui/RoundButton";

export const MarketplaceButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setFromRoute } = useContext(Context);

  const isWorldRoute = location.pathname.includes("/world");

  return (
    <RoundButton
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
    >
      <img
        src={tradeIcon}
        className="absolute group-active:translate-y-[2px]"
        style={{
          top: `${PIXEL_SCALE * 2.6}px`,
          left: `${PIXEL_SCALE * 3.4}px`,
          width: `${PIXEL_SCALE * 15.5}px`,
        }}
      />
    </RoundButton>
  );
};
