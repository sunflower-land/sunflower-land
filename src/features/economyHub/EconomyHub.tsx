import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import useSWR from "swr";
import { useActor, useSelector } from "@xstate/react";

import { OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSafeAreaPaddingTop } from "lib/utils/hooks/useSafeAreaPaddingTop";

import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import {
  Context as GameMachineContext,
  MachineState,
  type BlockchainEvent,
} from "features/game/lib/gameMachine";
import { hasFeatureAccess } from "lib/flags";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";

import {
  economiesListPageFetcher,
  economiesListPageSwrKey,
  isEconomyHubOffline,
  marketplaceEconomiesPageFetcher,
  marketplaceEconomiesPageSwrKey,
} from "features/marketplace/actions/loadEconomiesMarketplaceData";

import { RewardsWidget } from "./components/RewardsWidget";
import { CreateEconomyWidget } from "./components/CreateEconomyWidget";
import { TopTradeablesWidget } from "./components/TopTradeablesWidget";
import { MinigameList } from "./components/MinigameList";
import { mapEconomyOfferToExchangeRow } from "./lib/mapEconomyOffers";

const _state = (state: MachineState) => state.context.state;
const _farmId = (state: MachineState) => Number(state.context.farmId);

const HUB_PATH = "/economy-hub";

/**
 * Player-facing Economy Hub dashboard at `/economy-hub`.
 *
 * Layout mirrors the Chapter Dashboard: a header strip at the top with a
 * background image and a close button, then a two-column body — a skinny
 * left column (~1/5 width on desktop, full width on mobile) of widgets and
 * a wide right column containing a vertical list of minigame cards.
 */
export const EconomyHub: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(AuthProvider.Context);

  const state = useSelector(gameService, _state);
  const farmId = useSelector(gameService, _farmId);
  const [authState] = useActor(authService);
  const token = authState.context.user.rawToken as string;

  // In offline/dev mode (no `CONFIG.API_URL`) we skip the feature flag and
  // farm-id gates entirely — the loaders short-circuit to mock data, so we
  // want SWR to run regardless of the live game settings.
  const offline = isEconomyHubOffline();
  const playerEconomiesAllowed =
    offline || hasFeatureAccess(state, "PLAYER_ECONOMIES");

  const tradeablesSwrKey = playerEconomiesAllowed
    ? marketplaceEconomiesPageSwrKey(token ?? "")
    : null;

  const economiesSwrKey =
    playerEconomiesAllowed && (offline || farmId > 0)
      ? economiesListPageSwrKey(token ?? "", farmId || 0)
      : null;

  const {
    data: tradeablesData,
    isLoading: tradeablesLoading,
    mutate,
  } = useSWR(tradeablesSwrKey, marketplaceEconomiesPageFetcher);

  const {
    data: economiesData,
    isLoading: economiesLoading,
    mutate: mutateEconomies,
  } = useSWR(economiesSwrKey, economiesListPageFetcher);

  useOnMachineTransition<GameMachineContext, BlockchainEvent>(
    gameService,
    "exchangingEconomy",
    "exchangingEconomySuccess",
    () => {
      void mutateEconomies();
    },
    playerEconomiesAllowed,
  );

  const items = tradeablesData?.items ?? [];
  const economies = economiesData?.economies ?? [];

  const labelBySlug = useMemo(
    () => Object.fromEntries(economies.map((e) => [e.slug, e.label])),
    [economies],
  );

  const exchanges = useMemo(() => {
    const offers = economiesData?.exchanges ?? [];
    return offers.map((offer) =>
      mapEconomyOfferToExchangeRow(
        offer,
        labelBySlug[offer.slug] ?? offer.slug,
      ),
    );
  }, [economiesData?.exchanges, labelBySlug]);

  // When the player returns to the hub (e.g. after closing a minigame
  // iframe), force-refetch so counters and leaderboards reflect any
  // changes that happened while they were playing.
  useEffect(() => {
    if (pathname === HUB_PATH) {
      mutate();
      mutateEconomies();
    }
  }, [pathname, mutate, mutateEconomies]);

  const showClose = pathname.includes("/game") || pathname === HUB_PATH;

  const safeAreaPaddingTop = useSafeAreaPaddingTop(50);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div
      className="bg-[#181425] w-full h-full safe-area-inset-bottom"
      style={{ paddingTop: safeAreaPaddingTop }}
    >
      <OuterPanel className="relative h-full pointer-events-auto flex flex-col overflow-y-auto scrollable">
        {/* Header: background image strip with a close button. No banner. */}
        <div className="relative flex w-full justify-between pr-10 items-center mr-auto h-20 min-h-20 shrink-0 mb-2">
          <div
            className="absolute inset-0 w-full h-full -z-0 rounded-sm"
            style={{
              backgroundImage: `url(${SUNNYSIDE.decorations.ocean})`,
              backgroundRepeat: "repeat",
              imageRendering: "pixelated",
              backgroundSize: `${64 * PIXEL_SCALE}px`,
              backgroundPosition: "top left",
            }}
          />
          <div className="absolute inset-0 w-full h-full bg-black opacity-35 -z-0 rounded-sm" />

          {showClose && (
            <img
              src={SUNNYSIDE.icons.close}
              className="flex-none cursor-pointer absolute right-2 z-10"
              onClick={handleClose}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                height: `${PIXEL_SCALE * 11}px`,
              }}
            />
          )}
        </div>

        {/* Body: skinny left column + wide right column. */}
        <div className="flex flex-col lg:flex-row gap-2 pb-4">
          <div className="w-full lg:w-1/5">
            <RewardsWidget exchanges={exchanges} />
            <CreateEconomyWidget />
            <TopTradeablesWidget items={items} isLoading={tradeablesLoading} />
          </div>

          <div className="flex-1">
            <MinigameList economies={economies} isLoading={economiesLoading} />
          </div>
        </div>
      </OuterPanel>
    </div>
  );
};
