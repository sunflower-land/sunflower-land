import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import tradeIcon from "assets/icons/trade.png";
import { RoundButton } from "components/ui/RoundButton";
import { useMarketplaceNavigation } from "features/marketplace/lib/navigation";

export const MarketplaceButton = () => {
  const { openMarketplace } = useMarketplaceNavigation();

  return (
    <RoundButton
      onClick={() => {
        openMarketplace();
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
