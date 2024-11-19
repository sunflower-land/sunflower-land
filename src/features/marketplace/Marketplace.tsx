import { SUNNYSIDE } from "assets/sunnyside";
import React, { useContext } from "react";
import shopIcon from "assets/icons/shop.png";
import giftIcon from "assets/icons/gift.png";
import sflIcon from "assets/icons/sfl.webp";
import { MarketplaceProfile } from "./components/MarketplaceProfile";
import {
  MarketplaceHome,
  MarketplaceNavigation,
} from "./components/MarketplaceHome";
import { MarketplaceRewards } from "./components/MarketplaceRewards";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ButtonPanel, OuterPanel } from "components/ui/Panel";
import { Tradeable } from "./components/Tradeable";
import { Context } from "features/game/GameProvider";
import { MyListings } from "./components/profile/MyListings";
import { MyOffers } from "./components/profile/MyOffers";
import { MarketplaceListings } from "./components/MarketplaceListings";

const tabs = [
  {
    name: "Market",
    icon: shopIcon,
    alert: 0,
    route: "/marketplace",
  },
  {
    name: "Profile",
    icon: SUNNYSIDE.icons.player,
    alert: 1,
    route: "/marketplace/profile",
  },
  {
    name: "Rewards",
    icon: giftIcon,
    alert: 0,
    route: "/marketplace/rewards",
  },
];

export const Marketplace: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { gameService } = useContext(Context);

  const sfl = gameService.getSnapshot().context.state.balance;

  return (
    <>
      <div className="bg-[#181425] w-full h-full">
        <OuterPanel className="h-full">
          <div
            className="relative flex justify-between pr-10 items-center overflow-x-auto scrollbar-hide mr-auto h-16  mb-0.5"
            style={{}}
          >
            <div
              className="absolute inset-0 w-full h-full -z-0 rounded-sm"
              // Repeating pixel art image background
              style={{
                backgroundImage: `url(${SUNNYSIDE.announcement.marketplace})`,

                imageRendering: "pixelated",
                backgroundSize: "320px",
                backgroundPosition: "center",
              }}
            />
            <div className="z-10 pl-4">
              <p className="text-lg text-white z-10 text-shadow">Marketplace</p>
              <p className="text-xs text-white z-10 text-shadow">
                Buy, swap, sell!
              </p>
            </div>

            <div className="flex items-center z-10">
              <img src={sflIcon} className="w-8 mr-1" />
              <p className="text-sm text-white">{sfl.toFixed(2)}</p>
            </div>
            <img
              src={SUNNYSIDE.icons.close}
              className="flex-none cursor-pointer absolute right-2"
              onClick={() => {
                navigate("/");
              }}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                height: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>

          <MarketplaceNavigation />
        </OuterPanel>
      </div>
    </>
  );
};
