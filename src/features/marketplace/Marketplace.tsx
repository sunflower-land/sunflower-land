import { SUNNYSIDE } from "assets/sunnyside";
import React, { useContext } from "react";
import shopIcon from "assets/icons/shop.png";
import giftIcon from "assets/icons/gift.png";
import sflIcon from "assets/icons/sfl.webp";
import { MarketplaceProfile } from "./components/MarketplaceProfile";
import { MarketplaceHome } from "./components/MarketplaceHome";
import { MarketplaceRewards } from "./components/MarketplaceRewards";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ButtonPanel, OuterPanel } from "components/ui/Panel";
import { Tradeable } from "./components/Tradeable";
import { Context } from "features/game/GameProvider";

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
        <OuterPanel className="h-full" style={{ paddingBottom: "42px" }}>
          <div className="flex items-center overflow-x-auto scrollbar-hide mr-auto">
            {tabs.map((tab, index) => (
              <ButtonPanel
                selected={tab.route === pathname}
                key={`tab-${index}`}
                className="flex items-center relative mr-1"
                onClick={() => {
                  // Navigate
                  navigate(tab.route);
                }}
              >
                <span
                  className={classNames(
                    "text-xs sm:text-sm text-ellipsis ml-1 whitespace-nowrap",
                  )}
                >
                  {tab.name}
                </span>
              </ButtonPanel>
            ))}

            <div className="flex items-center">
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

          <Routes>
            <Route path="/" element={<MarketplaceHome />} />
            <Route path="/profile" element={<MarketplaceProfile />} />
            <Route path="/rewards" element={<MarketplaceRewards />} />
            <Route path="/:collection/:id" element={<Tradeable />} />
            <Route path="/:collection" element={<MarketplaceHome />} />
          </Routes>
        </OuterPanel>
      </div>
    </>
  );
};
