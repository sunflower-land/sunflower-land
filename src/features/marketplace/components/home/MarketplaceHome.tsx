import React, { useContext, useEffect, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import filterIcon from "assets/icons/filter_icon.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import crownIcon from "assets/icons/vip.webp";
import { Route, Routes, useNavigate } from "react-router";
import { Collection, preloadCollections } from "../Collection";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { MarketplaceProfile } from "../MarketplaceProfile";
import { MyTrades } from "../profile/MyTrades";
import { MarketplaceRewards } from "../MarketplaceRewards";
import { Tradeable } from "../Tradeable";
import { MarketplaceHotNow } from "../MarketplaceHotNow";
import { CONFIG } from "lib/config";
import { MarketplaceUser } from "../MarketplaceUser";
import { Context } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import {
  getAccountTradedRestrictionSecondsLeft,
  isAccountTradedWithin90Days,
  MachineState,
} from "features/game/lib/gameMachine";
import { TradeCooldownWidget } from "features/game/components/TradeCooldownWidget";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import {
  getRemainingTrades,
  hasReputation,
  Reputation,
} from "features/game/lib/reputation";
import { MarketplaceSearch } from "../MarketplaceSearch";

import { EstimatedPrice } from "./EstimatedPrice";
import { Filters } from "./Filters";
import { CHAPTERS } from "features/game/types/chapters";

const _hasTradeReputation = (state: MachineState) =>
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Cropkeeper,
  });
export const MarketplaceNavigation: React.FC = () => {
  const navigate = useNavigate();
  const crabChapterStartMs = CHAPTERS["Crabs and Traps"].startDate.getTime();

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickswap, setShowQuickswap] = useState(false);
  const [hideLimited, setHideLimited] = useState<boolean>(() => {
    const now = Date.now();

    return now >= crabChapterStartMs;
  });

  const { openModal } = useContext(ModalContext);

  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  useEffect(() => {
    if (hideLimited) return;
    const msToChapterStart = crabChapterStartMs - Date.now();

    if (msToChapterStart <= 0) {
      queueMicrotask(() => setHideLimited(true));
      return;
    }

    const id = window.setTimeout(() => {
      setHideLimited(true);
    }, msToChapterStart);

    return () => window.clearTimeout(id);
  }, [hideLimited, crabChapterStartMs]);

  useEffect(() => {
    const token = authState.context.user.rawToken as string;
    if (CONFIG.API_URL) preloadCollections(token, !hideLimited);
  }, [hideLimited, authState.context.user.rawToken]);

  const { t } = useTranslation();

  const { gameService } = useContext(Context);
  const price = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;
  const { farmId } = gameService.getSnapshot().context;

  const hasTradeReputation = useSelector(gameService, _hasTradeReputation);
  const accountTradedRecently = useSelector(gameService, (s) =>
    isAccountTradedWithin90Days(s.context),
  );
  const restrictionSecondsLeft = useSelector(gameService, (s) =>
    getAccountTradedRestrictionSecondsLeft(s.context),
  );

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
          <Filters
            onClose={() => setShowFilters(false)}
            farmId={farmId}
            hideLimited={hideLimited}
          />
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
        <div className="w-64  mr-1 hidden lg:flex flex-col">
          <InnerPanel className="w-full flex-col mb-1">
            <MarketplaceSearch search={search} setSearch={setSearch} />
            <div className="flex-1">
              <Filters farmId={farmId} hideLimited={hideLimited} />
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

          {accountTradedRecently && (
            <TradeCooldownWidget
              restrictionSecondsLeft={restrictionSecondsLeft}
            />
          )}

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
              hideLimited={hideLimited}
              onNavigated={() => {
                setSearch("");
              }}
            />
          ) : (
            <Routes>
              <Route path="/profile" element={<MarketplaceProfile />} />
              <Route path="/hot" element={<MarketplaceHotNow />} />
              <Route
                path="/collection/*"
                element={<Collection hideLimited={hideLimited} />}
              />
              <Route
                path="/:collection/:id"
                element={<Tradeable hideLimited={hideLimited} />}
              />
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
