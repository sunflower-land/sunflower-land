import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useState } from "react";
import budIcon from "assets/icons/bud.png";
import wearableIcon from "assets/icons/wearables.webp";
import lightning from "assets/icons/lightning.png";
import filterIcon from "assets/icons/filter_icon.webp";
import tradeIcon from "assets/icons/trade.png";
import trade_point from "src/assets/icons/trade_point.webp";

import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Collection } from "./Collection";
import { SUNNYSIDE } from "assets/sunnyside";
import { TextInput } from "components/ui/TextInput";
import { SquareIcon } from "components/ui/SquareIcon";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { MarketplaceProfile } from "./MarketplaceProfile";
import { MyTrades } from "./profile/MyTrades";
import { MarketplaceRewards } from "./MarketplaceRewards";
import { Tradeable } from "./Tradeable";
import classNames from "classnames";
import { MarketplaceHotNow } from "./MarketplaceHotNow";
import { CONFIG } from "lib/config";

export const MarketplaceNavigation: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <Modal show={showFilters} onHide={() => setShowFilters(false)}>
        <CloseButtonPanel>
          <Filters onClose={() => setShowFilters(false)} />
        </CloseButtonPanel>
      </Modal>

      <div className="flex  items-center lg:hidden h-[50px]">
        <TextInput
          icon={SUNNYSIDE.icons.search}
          value={search}
          onValueChange={setSearch}
        />
        <img
          src={filterIcon}
          onClick={() => setShowFilters(true)}
          className="h-8 mx-1 block cursor-pointer"
        />
      </div>

      <div className="flex h-[calc(100%-50px)] lg:h-full">
        <InnerPanel className="w-64 h-96 mr-1 hidden lg:flex  flex-col">
          <div className="flex  items-center">
            <TextInput
              icon={SUNNYSIDE.icons.search}
              value={search}
              onValueChange={setSearch}
              onCancel={() => setSearch("")}
            />
          </div>
          <div className="flex-1">
            <Filters onClose={() => setShowFilters(false)} />
          </div>
        </InnerPanel>

        <div className="flex-1 flex flex-col w-full">
          {search ? (
            <Collection search={search} onNavigated={() => setSearch("")} />
          ) : (
            <Routes>
              <Route path="/profile" element={<MarketplaceProfile />} />
              <Route path="/hot" element={<MarketplaceHotNow />} />
              <Route path="/trades" element={<MyTrades />} />
              <Route path="/rewards" element={<MarketplaceRewards />} />
              <Route path="/collection/*" element={<Collection />} />
              <Route path="/:collection/:id" element={<Tradeable />} />
              {/* default to hot */}
              <Route path="/" element={<MarketplaceHotNow />} />
            </Routes>
          )}
        </div>
      </div>
    </>
  );
};

export type MarketplacePurpose = "boost" | "decoration" | "resource";

const Option: React.FC<{
  icon: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  options?: {
    icon: string;
    label: string;
    onClick: () => void;
    isActive?: boolean;
  }[];
}> = ({ icon, label, onClick, options, isActive }) => {
  return (
    <div className="mb-1">
      <div
        className={classNames(
          "flex justify-between items-center cursor-pointer mb-1 ",
          { "bg-brown-100 px-2 -mx-2": isActive },
        )}
        onClick={onClick}
      >
        <div className="flex items-center">
          <SquareIcon icon={icon} width={10} />
          <span className="text-sm ml-2">{label}</span>
        </div>
        <img src={SUNNYSIDE.icons.chevron_right} className="w-4" />
      </div>

      {options?.map((option) => (
        <div
          key={option.label}
          className={classNames(
            "flex justify-between items-center cursor-pointer mb-1 ml-4",
            { "bg-brown-100 px-2 -mr-2 ml-0": option.isActive },
          )}
          onClick={option.onClick}
        >
          <div className="flex items-center">
            <SquareIcon icon={option.icon} width={10} />
            <span className="text-sm ml-2">{option.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Filters: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [queryParams] = useSearchParams();
  const filters = queryParams.get("filters");

  return (
    <div className="p-1 h-full">
      <div className="flex flex-col h-full">
        <div>
          <Option
            icon={SUNNYSIDE.icons.expression_alerted}
            label="Hot now"
            onClick={() => {
              navigate(`/marketplace/hot`);
              onClose();
            }}
            isActive={pathname === "/marketplace/hot"}
          />
          <Option
            icon={lightning}
            label="Power ups"
            onClick={() =>
              navigate(
                `/marketplace/collection?filters=collectibles,wearables,utility`,
              )
            }
            isActive={filters === "collectibles,wearables,utility"}
            options={
              filters?.includes("utility")
                ? [
                    {
                      icon: ITEM_DETAILS["Freya Fox"].image,
                      label: "Collectibles",
                      isActive: filters === "utility,collectibles",
                      onClick: () => {
                        navigate(
                          `/marketplace/collection?filters=utility,collectibles`,
                        );
                        onClose();
                      },
                    },
                    {
                      icon: wearableIcon,
                      label: "Wearables",
                      isActive: filters === "utility,wearables",
                      onClick: () => {
                        navigate(
                          `/marketplace/collection?filters=utility,wearables`,
                        );
                        onClose();
                      },
                    },
                  ]
                : undefined
            }
          />

          <Option
            icon={ITEM_DETAILS.Eggplant.image}
            label="Resources"
            onClick={() => {
              navigate(`/marketplace/collection?filters=resources`);
              onClose();
            }}
            isActive={filters === "resources"}
          />

          <Option
            icon={SUNNYSIDE.icons.heart}
            label="Cosmetics"
            onClick={() => {
              navigate(
                `/marketplace/collection?filters=collectibles,wearables,cosmetic`,
              );
              onClose();
            }}
            isActive={filters === "collectibles,wearables,cosmetic"}
          />

          {CONFIG.NETWORK !== "mainnet" && (
            <Option
              icon={budIcon}
              label="Bud NFTs"
              onClick={() => {
                navigate(`/marketplace/collection?filters=buds`, {});
                onClose();
              }}
              isActive={filters === "buds"}
            />
          )}
        </div>

        <div>
          <Option
            icon={tradeIcon}
            label="My trades"
            onClick={() => {
              navigate(`/marketplace/trades`, {
                state: { from: location.pathname },
              });
              onClose();
            }}
            isActive={pathname === "/marketplace/trades"}
          />
          <Option
            icon={trade_point}
            label="My rewards"
            onClick={() => {
              navigate(`/marketplace/rewards`, {
                state: { from: location.pathname },
              });
              onClose();
            }}
            isActive={pathname === "/marketplace/rewards"}
          />
        </div>
      </div>
    </div>
  );
};
