import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useEffect, useState } from "react";
import budIcon from "assets/icons/bud.png";
import wearableIcon from "assets/icons/wearables.webp";
import lightning from "assets/icons/lightning.png";
import filterIcon from "assets/icons/filter_icon.webp";
import tradeIcon from "assets/icons/trade.png";
import trade_point from "src/assets/icons/trade_points_coupon.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import crownIcon from "assets/icons/vip.webp";

import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { Collection, preloadCollections } from "./Collection";
import { SUNNYSIDE } from "assets/sunnyside";
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
import { MarketplaceUser } from "./MarketplaceUser";
import { Context } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { MachineState } from "features/game/lib/gameMachine";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import {
  getRemainingTrades,
  hasReputation,
  Reputation,
} from "features/game/lib/reputation";
import { MarketplaceSearch } from "./MarketplaceSearch";
import { PET_CATEGORY_NAMES, PET_NFT_TYPES } from "features/game/types/pets";
import { AURA_TRAITS, BIB_TRAITS } from "features/pets/data/types";
import camelCase from "lodash.camelcase";

const _hasTradeReputation = (state: MachineState) =>
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Cropkeeper,
  });

export const MarketplaceNavigation: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickswap, setShowQuickswap] = useState(false);

  const { openModal } = useContext(ModalContext);

  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  useEffect(() => {
    const token = authState.context.user.rawToken as string;
    if (CONFIG.API_URL) preloadCollections(token);
  }, []);
  const { t } = useTranslation();

  const { gameService } = useContext(Context);
  const price = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;
  const { farmId } = gameService.getSnapshot().context;

  const hasTradeReputation = useSelector(gameService, _hasTradeReputation);

  const listingsLeft = getRemainingTrades({
    game: gameService.getSnapshot().context.state,
  });

  const goToFlowerDashboard = () => {
    navigate("/game/flower-dashboard");
  };

  return (
    <>
      <Modal show={showFilters} onHide={() => setShowFilters(false)}>
        <CloseButtonPanel>
          <Filters onClose={() => setShowFilters(false)} farmId={farmId} />
          <EstimatedPrice price={price} />
          {/* Flower Dashboard Button */}
          <Button contentAlign="start" onClick={goToFlowerDashboard}>
            <div className="flex">
              <img src={flowerIcon} className="w-6 mr-2" />
              <span className="mt-0.5">{t("flowerDashboard.title")}</span>
            </div>
          </Button>
        </CloseButtonPanel>
      </Modal>

      <Modal show={showQuickswap} onHide={() => setShowQuickswap(false)}>
        <CloseButtonPanel onClose={() => setShowQuickswap(false)}>
          <div className="p-1">
            <Label type="danger" className="mb-2">
              {t("marketplace.quickswap")}
            </Label>
            <p className="text-sm mb-2">
              {t("marketplace.quickswap.description")}
            </p>
            <p className="text-sm mb-2">{t("marketplace.quickswap.warning")}</p>
            <Button
              onClick={() => {
                window.open(
                  "https://quickswap.exchange/#/swap?swapIndex=0&currency0=ETH&currency1=0xD1f9c58e33933a993A3891F8acFe05a68E1afC05",
                  "_blank",
                );
              }}
            >
              {t("continue")}
            </Button>
          </div>
        </CloseButtonPanel>
      </Modal>

      <div className="flex justify-between lg:hidden h-[50px]">
        <MarketplaceSearch search={search} setSearch={setSearch} />
        <div className="flex">
          <img
            src={filterIcon}
            onClick={() => setShowFilters(true)}
            className="h-9 block mx-1 mt-1 cursor-pointer"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="flex h-[calc(100%-50px)] lg:h-full">
        <div className="w-64  mr-1 hidden lg:flex  flex-col">
          <InnerPanel className="w-full flex-col mb-1">
            <MarketplaceSearch search={search} setSearch={setSearch} />
            <div className="flex-1">
              <Filters onClose={() => setShowFilters(false)} farmId={farmId} />
            </div>
          </InnerPanel>

          <EstimatedPrice price={price} />
          {/* Flower Dashboard Button */}
          <Button contentAlign="start" onClick={goToFlowerDashboard}>
            <div className="flex">
              <img src={flowerIcon} className="w-6 mr-2" />
              <span className="mt-0.5">{t("flowerDashboard.title")}</span>
            </div>
          </Button>

          {!hasTradeReputation && (
            <InnerPanel
              className="cursor-pointer"
              onClick={() => openModal("REPUTATION")}
            >
              <div className="flex flex-col p-1">
                <div className="flex justify-between items-center">
                  <Label type="danger" icon={crownIcon}>
                    {`${listingsLeft} ${listingsLeft > 1 ? t("reputation.marketplace.listingsLeft") : t("reputation.marketplace.listingLeft")}`}
                  </Label>
                  <p className="text-xxs underline">{t("read.more")}</p>
                </div>
                <p className="text-xs">{t("reputation.marketplace.trades")}</p>
              </div>
            </InnerPanel>
          )}
        </div>

        <div className="flex-1 flex flex-col w-full">
          {search ? (
            <Collection
              search={search}
              onNavigated={() => {
                setSearch("");
              }}
            />
          ) : (
            <Routes>
              <Route path="/profile" element={<MarketplaceProfile />} />
              <Route path="/hot" element={<MarketplaceHotNow />} />
              <Route path="/collection/*" element={<Collection />} />
              <Route path="/:collection/:id" element={<Tradeable />} />
              <Route path="/profile/:id" element={<MarketplaceUser />} />
              <Route path="/profile/:id/trades" element={<MyTrades />} />
              <Route path="/profile/rewards" element={<MarketplaceRewards />} />
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

interface OptionProps {
  icon: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  options?: OptionProps[];
  level?: number;
}

const Option: React.FC<OptionProps> = ({
  icon,
  label,
  onClick,
  options,
  isActive,
  level = 0,
}) => {
  return (
    <div className="mb-1">
      <div
        className={classNames(
          "flex justify-between items-center cursor-pointer mb-1 ",
          { "bg-brown-100 px-2 -mx-2": isActive },
        )}
        onClick={onClick}
      >
        <div
          className="flex items-center"
          style={{ marginLeft: level > 0 ? `${level * 15}px` : undefined }}
        >
          <SquareIcon icon={icon} width={10} />
          <span className="text-sm ml-2">{label}</span>
        </div>
        <img
          src={
            options
              ? SUNNYSIDE.icons.chevron_down
              : SUNNYSIDE.icons.chevron_right
          }
          className={`${options ? "w-6" : "w-[18px]"}`}
          style={{ marginRight: level > 0 ? `${level * 20}px` : undefined }}
        />
      </div>

      {options?.map((option) => (
        <Option key={option.label} {...option} level={level + 1} />
      ))}
    </div>
  );
};

const Filters: React.FC<{
  onClose: () => void;
  farmId: number;
}> = ({ onClose, farmId }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [queryParams] = useSearchParams();
  const filters = queryParams.get("filters");
  const { t } = useTranslation();
  const isWorldRoute = pathname.includes("/world");

  const baseUrl = `${isWorldRoute ? "/world" : ""}/marketplace`;
  const navigateTo = ({
    path,
    filterParams,
  }: {
    path: string;
    filterParams?: string;
  }) => {
    const url = filterParams
      ? `${baseUrl}/collection?filters=${filterParams}`
      : `${baseUrl}/${path}`;

    navigate(url);
    onClose();
  };

  const filterOptions: OptionProps[] = [
    {
      icon: SUNNYSIDE.icons.expression_alerted,
      label: t("marketplace.trending"),
      onClick: () => navigateTo({ path: "hot" }),
      isActive: pathname === `${baseUrl}/hot`,
    },
    {
      icon: lightning,
      label: t("marketplace.powerUps"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "collectibles,wearables,utility",
        }),
      isActive: filters === "collectibles,wearables,utility",
      options: filters?.includes("utility")
        ? [
            {
              icon: ITEM_DETAILS["Freya Fox"].image,
              label: t("marketplace.collectibles"),
              isActive: filters === "utility,collectibles",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "utility,collectibles",
                }),
            },
            {
              icon: wearableIcon,
              label: t("marketplace.wearables"),
              isActive: filters === "utility,wearables",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "utility,wearables",
                }),
            },
          ]
        : undefined,
    },
    {
      icon: ITEM_DETAILS.Eggplant.image,
      label: t("marketplace.resources"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "resources",
        }),
      isActive: filters === "resources",
    },
    {
      icon: SUNNYSIDE.icons.stopwatch,
      label: t("marketplace.limited"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "temporary",
        }),
      isActive: filters === "temporary",
    },
    {
      icon: SUNNYSIDE.icons.heart,
      label: t("marketplace.cosmetics"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "collectibles,wearables,cosmetic",
        }),
      isActive: filters === "collectibles,wearables,cosmetic",
      options: filters?.includes("cosmetic")
        ? [
            {
              icon: ITEM_DETAILS["Freya Fox"].image,
              label: t("marketplace.collectibles"),
              isActive: filters === "cosmetic,collectibles",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "cosmetic,collectibles",
                }),
            },
            {
              icon: wearableIcon,
              label: t("marketplace.wearables"),
              isActive: filters === "cosmetic,wearables",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "cosmetic,wearables",
                }),
            },
          ]
        : undefined,
    },
    {
      icon: budIcon,
      label: t("marketplace.budNfts"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "buds",
        }),
      isActive: filters === "buds",
    },
    {
      icon: ITEM_DETAILS.Ramsey.image,
      label: t("marketplace.pets"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "pets",
        }),
      isActive: filters === "pets",
      options: filters?.includes("pets")
        ? [
            {
              icon: "",
              label: "Breed",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "pets?type",
                }),
              isActive: filters === "pets?type",
              options: filters?.includes("pets?type")
                ? [
                    ...PET_NFT_TYPES.map((type) => ({
                      icon: "",
                      label: type,
                      onClick: () =>
                        navigateTo({
                          path: "collection",
                          filterParams: `pets?type=${type}`,
                        }),
                      isActive: filters === `pets?type=${type}`,
                    })),
                  ]
                : undefined,
            },
            {
              icon: "",
              label: "Category",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "pets?category",
                }),
              isActive: filters === "pets?category",
              options: filters?.includes("pets?category")
                ? [
                    ...PET_CATEGORY_NAMES.map((category) => ({
                      icon: "",
                      label: category,
                      onClick: () =>
                        navigateTo({
                          path: "collection",
                          filterParams: `pets?category=${category}`,
                        }),
                      isActive: filters === `pets?category=${category}`,
                    })),
                  ]
                : undefined,
            },
            {
              icon: "",
              label: "Aura",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "pets?aura",
                }),
              isActive: filters === "pets?aura",
              options: filters?.includes("pets?aura")
                ? [
                    ...AURA_TRAITS.map((aura) => {
                      const auraCamelCase = camelCase(aura);
                      const label =
                        aura === "No Aura" ? "None" : aura.split(" ")[0];

                      return {
                        icon: "",
                        label,
                        onClick: () =>
                          navigateTo({
                            path: "collection",
                            filterParams: `pets?aura=${auraCamelCase}`,
                          }),
                        isActive: filters === `pets?aura=${auraCamelCase}`,
                      };
                    }),
                  ]
                : undefined,
            },
            {
              icon: "",
              label: "Bib",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "pets?bib",
                }),
              isActive: filters === "pets?bib",
              options: filters?.includes("pets?bib")
                ? [
                    ...BIB_TRAITS.map((bib) => {
                      const bibCamelCase = camelCase(bib);

                      return {
                        icon: "",
                        label: bib,
                        onClick: () =>
                          navigateTo({
                            path: "collection",
                            filterParams: `pets?bib=${bibCamelCase}`,
                          }),
                        isActive: filters === `pets?bib=${bibCamelCase}`,
                      };
                    }),
                  ]
                : undefined,
            },
          ]
        : undefined,
    },
    {
      icon: SUNNYSIDE.icons.player,
      label: t("marketplace.myProfile"),
      onClick: () =>
        navigateTo({
          path: `profile/${farmId}`,
        }),
      options: pathname.includes("profile")
        ? [
            {
              icon: SUNNYSIDE.icons.lightning,
              label: t("marketplace.stats"),
              onClick: () =>
                navigateTo({
                  path: `profile/${farmId}`,
                }),
              isActive: pathname === `${baseUrl}/profile/${farmId}`,
            },
            {
              icon: tradeIcon,
              label: t("marketplace.trades"),
              onClick: () =>
                navigateTo({
                  path: `profile/${farmId}/trades`,
                }),
              isActive: pathname === `${baseUrl}/profile/${farmId}/trades`,
            },
            {
              icon: trade_point,
              label: t("marketplace.rewards"),
              onClick: () =>
                navigateTo({
                  path: "profile/rewards",
                }),
              isActive: pathname === `${baseUrl}/profile/rewards`,
            },
          ]
        : undefined,
    },
  ];

  return (
    <div className="flex flex-col p-1 h-full">
      {filterOptions.map((option) => (
        <Option key={option.label} {...option} />
      ))}
    </div>
  );
};

const EstimatedPrice: React.FC<{ price: number }> = ({ price }) => {
  const { t } = useTranslation();
  return (
    <InnerPanel className="mb-1">
      <div className="flex justify-between items-center pr-1">
        <div className="flex items-center">
          <img src={flowerIcon} className="w-6" />
          <span className="text-sm ml-2">{`$${price.toFixed(4)}`}</span>
        </div>
      </div>
      <p className="text-xxs italic">{t("marketplace.estimated.price")}</p>
    </InnerPanel>
  );
};
