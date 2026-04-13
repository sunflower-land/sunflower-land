import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components/Loading";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import checkeredBg from "assets/land/checkered_bg.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import { minigameDashboardBackdropStyle } from "./lib/minigameBoardPixels";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import { useSafeAreaPaddingTop } from "lib/utils/hooks/useSafeAreaPaddingTop";
import { Portal } from "features/world/ui/portals/Portal";
import { loadMinigameDashboard } from "./lib/loadMinigameDashboard";
import {
  postEconomyPurchasedEvent,
  postPlayerEconomyActionedEvent,
} from "./lib/minigameSessionApi";
import { processPlayerEconomyAction } from "./lib/processPlayerEconomyAction";
import type { PlayerEconomyRuntimeState } from "./lib/types";
import type {
  MinigameDashboardData,
  MinigameFlowerPurchaseItemUi,
  MinigameShopItemUi,
} from "./lib/minigameDashboardTypes";
import { getMinigameTokenImage } from "./lib/minigameTokenIcons";
import {
  canAttemptFlowerPurchase,
  canAttemptShopPurchase,
  isShopItemBoughtOrDisabled,
} from "./lib/minigameShopAvailability";
import { MinigameShopPanel } from "./components/MinigameShopPanel";
import { MinigameShopDetailBody } from "./components/MinigameShopDetailBody";
import { MinigameFlowerPurchaseDetailBody } from "./components/MinigameFlowerPurchaseDetailBody";
import { MinigameMobileShopModal } from "./components/MinigameMobileShopModal";
import { MinigameInventoryHud } from "./components/MinigameInventoryHud";
import { MinigameConfirmPanel } from "./components/MinigameConfirmPanel";
import { MinigameInventoryModal } from "./components/MinigameInventoryModal";
import { MinigameTrophySection } from "./components/MinigameTrophySection";
import { MinigameTrophyDetailModal } from "./components/MinigameTrophyDetailModal";
import { clonePlayerEconomyRuntimeState } from "./lib/processPlayerEconomyAction";
import { hasFeatureAccess } from "lib/flags";
import { MinigameCurrencyWidget } from "./components/MinigameCurrencyWidget";
import { MinigameHighscoreWidget } from "./components/MinigameHighscoreWidget";
import { getPrimaryTradableMarketplaceItem } from "./lib/minigameConfigHelpers";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";
import type { MinigameLoadError } from "./lib/minigameDashboardTypes";
import { makeGame } from "features/game/lib/transforms";
import type { GameState } from "features/game/types/game";

function runtimeAfterFlowerMint(
  runtime: PlayerEconomyRuntimeState,
  tokenKey: string,
  amount: number,
): PlayerEconomyRuntimeState {
  const prev = runtime.balances[tokenKey] ?? 0;
  return {
    ...runtime,
    balances: {
      ...runtime.balances,
      [tokenKey]: Math.max(0, Math.floor(prev)) + amount,
    },
    activity: (runtime.activity ?? 0) + 1,
  };
}

function MinigameDashboardBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={minigameDashboardBackdropStyle(checkeredBg)}
    />
  );
}

export const MinigameDashboard: React.FC = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const safeTop = useSafeAreaPaddingTop(12);
  const { t } = useAppTranslation();

  const { gameService } = useContext(GameContext);
  const [gameState] = useActor(gameService);
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const farmId = gameState.context.farmId;
  const userToken = authState.context.user.rawToken as string | undefined;
  const playerEconomiesBlocked = !hasFeatureAccess(
    gameState.context.state,
    "PLAYER_ECONOMIES",
  );

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<MinigameLoadError | null>(null);
  const [payload, setPayload] = useState<MinigameDashboardData | null>(null);
  const [runtime, setRuntime] = useState<PlayerEconomyRuntimeState | null>(
    null,
  );

  const [pendingShopItem, setPendingShopItem] =
    useState<MinigameShopItemUi | null>(null);
  const [pendingFlowerItem, setPendingFlowerItem] =
    useState<MinigameFlowerPurchaseItemUi | null>(null);
  const [showShopConfirm, setShowShopConfirm] = useState(false);
  const [showFlowerConfirm, setShowFlowerConfirm] = useState(false);
  const [shopActionError, setShopActionError] = useState<string | null>(null);

  const [showAdventureConfirm, setShowAdventureConfirm] = useState(false);
  const [showAdventureNoLink, setShowAdventureNoLink] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  /** Bumps when opening inventory so the modal remounts with fresh selection state. */
  const [inventoryModalKey, setInventoryModalKey] = useState(0);
  const [inventoryFocusToken, setInventoryFocusToken] = useState<string | null>(
    null,
  );

  const [showMobileShop, setShowMobileShop] = useState(false);
  const [mobileShopPhase, setMobileShopPhase] = useState<"list" | "detail">(
    "list",
  );

  const runtimeRef = useRef<PlayerEconomyRuntimeState | null>(null);
  /** Bumped when each minigame POST starts; stale responses must not overwrite newer optimistic state. */
  const minigameRemoteActionSeqRef = useRef(0);
  const dashboardMountedRef = useRef(true);
  /** Bumped when the minigame iframe closes so dashboard data is refetched. */
  const [dashboardReloadKey, setDashboardReloadKey] = useState(0);

  const [showActionSyncError, setShowActionSyncError] = useState(false);
  const [actionSyncError, setActionSyncError] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [trophyDetailToken, setTrophyDetailToken] = useState<string | null>(
    null,
  );
  const applyRuntime = useCallback((next: PlayerEconomyRuntimeState | null) => {
    runtimeRef.current = next;
    setRuntime(next);
  }, []);

  useEffect(() => {
    dashboardMountedRef.current = true;
    return () => {
      dashboardMountedRef.current = false;
    };
  }, []);

  /** Welcome modal when lifetime activity is still zero (no actions recorded yet). */
  useEffect(() => {
    if (!runtime) return;
    if ((runtime.activity ?? 0) === 0) {
      queueMicrotask(() => {
        setShowWelcomeModal(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- use activity primitive, not full runtime object
  }, [slug, runtime?.activity]);

  useEffect(() => {
    if (playerEconomiesBlocked) {
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      const creds = userToken && farmId != null ? { userToken, farmId } : null;
      const res = await loadMinigameDashboard(slug, creds);
      if (cancelled) return;
      if (!res.ok) {
        setLoadError(res.error);
        setPayload(null);
        applyRuntime(null);
        setLoading(false);
        return;
      }
      setLoadError(null);
      setPayload(res.data);
      applyRuntime(res.data.state);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [
    slug,
    userToken,
    farmId,
    applyRuntime,
    dashboardReloadKey,
    playerEconomiesBlocked,
  ]);

  const handleClose = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (showPortal) return;
      if (showInventoryModal) {
        setShowInventoryModal(false);
        return;
      }
      if (trophyDetailToken !== null) {
        setTrophyDetailToken(null);
        return;
      }
      if (showMobileShop) {
        setShowMobileShop(false);
        setMobileShopPhase("list");
        setPendingShopItem(null);
        setPendingFlowerItem(null);
        setShopActionError(null);
        return;
      }
      if (showFlowerConfirm) {
        setShowFlowerConfirm(false);
        setPendingFlowerItem(null);
        setShopActionError(null);
        return;
      }
      if (showShopConfirm) {
        setShowShopConfirm(false);
        setPendingShopItem(null);
        setShopActionError(null);
        return;
      }
      if (showActionSyncError) {
        setShowActionSyncError(false);
        setActionSyncError(null);
        return;
      }
      if (showAdventureNoLink) {
        setShowAdventureNoLink(false);
        return;
      }
      if (showAdventureConfirm) {
        setShowAdventureConfirm(false);
        return;
      }
      if (showWelcomeModal) {
        setShowWelcomeModal(false);
        return;
      }
      handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [
    handleClose,
    showAdventureNoLink,
    showAdventureConfirm,
    showInventoryModal,
    showPortal,
    showMobileShop,
    showFlowerConfirm,
    showShopConfirm,
    showActionSyncError,
    showWelcomeModal,
    trophyDetailToken,
  ]);

  const openMobileShopList = useCallback(() => {
    setShopActionError(null);
    setPendingShopItem(null);
    setPendingFlowerItem(null);
    setShowMobileShop(true);
    setMobileShopPhase("list");
  }, []);

  const openInventory = useCallback((focusToken?: string) => {
    setInventoryFocusToken(focusToken ?? null);
    setInventoryModalKey((k) => k + 1);
    setShowInventoryModal(true);
  }, []);

  const onShopItemClick = (item: MinigameShopItemUi) => {
    if (!runtime) return;
    if (isShopItemBoughtOrDisabled(item)) {
      return;
    }
    setShopActionError(null);
    setPendingFlowerItem(null);
    setPendingShopItem(item);
    const desktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;
    if (desktop) {
      setShowShopConfirm(true);
    } else {
      setShowMobileShop(true);
      setMobileShopPhase("detail");
    }
  };

  const onMobileShopListPick = (item: MinigameShopItemUi) => {
    if (!runtime) return;
    if (isShopItemBoughtOrDisabled(item)) {
      return;
    }
    setShopActionError(null);
    setPendingFlowerItem(null);
    setPendingShopItem(item);
    setMobileShopPhase("detail");
  };

  const onFlowerItemClick = (item: MinigameFlowerPurchaseItemUi) => {
    if (!runtime) return;
    setShopActionError(null);
    setPendingShopItem(null);
    setPendingFlowerItem(item);
    const desktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;
    if (desktop) {
      setShowFlowerConfirm(true);
    } else {
      setShowMobileShop(true);
      setMobileShopPhase("detail");
    }
  };

  const onMobileFlowerListPick = (item: MinigameFlowerPurchaseItemUi) => {
    if (!runtime) return;
    setShopActionError(null);
    setPendingShopItem(null);
    setPendingFlowerItem(item);
    setMobileShopPhase("detail");
  };

  const confirmShopPurchase = () => {
    if (!payload || !pendingShopItem) return;
    const prev = runtimeRef.current;
    if (!prev) return;
    if (!canAttemptShopPurchase(pendingShopItem, prev.balances)) return;

    const local = processPlayerEconomyAction(payload.config, prev, {
      actionId: pendingShopItem.actionId,
      now: Date.now(),
    });
    if (!local.ok) {
      setShopActionError(local.error);
      return;
    }

    if (!CONFIG.API_URL) {
      applyRuntime(local.state);
      setShowShopConfirm(false);
      setShowMobileShop(false);
      setMobileShopPhase("list");
      setPendingShopItem(null);
      setShopActionError(null);
      return;
    }

    if (!userToken || farmId == null) {
      setShopActionError(t("minigame.dashboard.signInToAction"));
      return;
    }

    const snapshotRuntime = clonePlayerEconomyRuntimeState(prev);
    const shopActionId = pendingShopItem.actionId;

    applyRuntime(local.state);
    setShowShopConfirm(false);
    setShowMobileShop(false);
    setMobileShopPhase("list");
    setPendingShopItem(null);
    setShopActionError(null);

    void (async () => {
      const remoteSeq = ++minigameRemoteActionSeqRef.current;
      try {
        await postPlayerEconomyActionedEvent({
          farmId,
          userToken,
          portalId: payload.portalName,
          action: shopActionId,
        });
        if (!dashboardMountedRef.current) return;
        if (remoteSeq !== minigameRemoteActionSeqRef.current) return;
      } catch (e) {
        if (!dashboardMountedRef.current) return;
        if (remoteSeq !== minigameRemoteActionSeqRef.current) return;
        applyRuntime(snapshotRuntime);
        setActionSyncError(
          e instanceof Error ? e.message : t("minigame.dashboard.actionFailed"),
        );
        setShowActionSyncError(true);
      }
    })();
  };

  const confirmFlowerPurchase = () => {
    if (!payload || !pendingFlowerItem) return;
    const prev = runtimeRef.current;
    if (!prev) return;
    const item = pendingFlowerItem;
    if (
      !canAttemptFlowerPurchase(item.flower, gameState.context.state.balance)
    ) {
      return;
    }

    const balanceSnapshot = gameState.context.state.balance;
    const cost = new Decimal(item.flower);
    const nextBalance = balanceSnapshot.sub(cost);
    if (nextBalance.lt(0) || nextBalance.gt(balanceSnapshot)) {
      return;
    }

    const nextRuntime = runtimeAfterFlowerMint(
      prev,
      item.tokenKey,
      item.economyAmount,
    );

    if (!CONFIG.API_URL) {
      applyRuntime(nextRuntime);
      gameService.send({
        type: "UPDATE",
        state: makeGame({
          ...gameState.context.state,
          balance: nextBalance,
        } as GameState),
      });
      setShowFlowerConfirm(false);
      setShowMobileShop(false);
      setMobileShopPhase("list");
      setPendingFlowerItem(null);
      setPendingShopItem(null);
      setShopActionError(null);
      return;
    }

    if (!userToken || farmId == null) {
      setShopActionError(t("minigame.dashboard.signInToAction"));
      return;
    }

    const snapshotRuntime = clonePlayerEconomyRuntimeState(prev);
    const purchaseId = item.purchaseId;

    applyRuntime(nextRuntime);
    gameService.send({
      type: "UPDATE",
      state: makeGame({
        ...gameState.context.state,
        balance: nextBalance,
      } as GameState),
    });

    setShowFlowerConfirm(false);
    setShowMobileShop(false);
    setMobileShopPhase("list");
    setPendingFlowerItem(null);
    setPendingShopItem(null);
    setShopActionError(null);

    void (async () => {
      const remoteSeq = ++minigameRemoteActionSeqRef.current;
      try {
        const { gameState: gsPatch } = await postEconomyPurchasedEvent({
          farmId,
          userToken,
          portalId: payload.portalName,
          purchaseId,
        });
        if (!dashboardMountedRef.current) return;
        if (remoteSeq !== minigameRemoteActionSeqRef.current) return;
        if (gsPatch && typeof gsPatch === "object") {
          const cur = gameService.getSnapshot().context.state as GameState;
          gameService.send({
            type: "UPDATE",
            state: makeGame({
              ...cur,
              ...(gsPatch as Partial<GameState>),
            } as GameState),
          });
        }
      } catch (e) {
        if (!dashboardMountedRef.current) return;
        if (remoteSeq !== minigameRemoteActionSeqRef.current) return;
        applyRuntime(snapshotRuntime);
        const cur = gameService.getSnapshot().context.state as GameState;
        gameService.send({
          type: "UPDATE",
          state: makeGame({
            ...cur,
            balance: balanceSnapshot,
          } as GameState),
        });
        setActionSyncError(
          e instanceof Error ? e.message : t("minigame.dashboard.actionFailed"),
        );
        setShowActionSyncError(true);
      }
    })();
  };

  const confirmMobileShopBuy = () => {
    if (pendingFlowerItem) {
      confirmFlowerPurchase();
    } else {
      confirmShopPurchase();
    }
  };

  const headerToken = payload?.ui.headerBalanceToken ?? "";
  const headerBalance =
    runtime && headerToken
      ? new Decimal(runtime.balances[headerToken] ?? 0)
      : new Decimal(0);

  const loadErrorText =
    loadError === null
      ? null
      : loadError.kind === "message"
        ? loadError.text
        : loadError.kind === "unknown_player_economy"
          ? t("minigame.dashboard.unknownPlayerEconomy", {
              slug: loadError.slug,
            })
          : t("minigame.dashboard.signInToLoad");

  if (playerEconomiesBlocked) {
    return (
      <div
        className="relative flex min-h-screen flex-col items-center justify-center gap-2 p-4"
        style={{ paddingTop: safeTop }}
      >
        <MinigameDashboardBackdrop />
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-center text-white px-2">
            {t("minigame.dashboard.playerEconomiesNotAvailable")}
          </p>
          <Button onClick={handleClose}>
            {t("minigame.dashboard.goBack")}
          </Button>
        </div>
      </div>
    );
  }

  // While the adventure iframe is open, keep rendering the dashboard shell + Portal so
  // background refetches (token rotation, etc.) do not unmount the iframe and reload it.
  if (loading && !showPortal) {
    return (
      <div
        className="relative flex min-h-screen flex-col items-center justify-center p-4"
        style={{ paddingTop: safeTop }}
      >
        <MinigameDashboardBackdrop />
        <div className="relative z-10 flex w-full flex-1 items-center justify-center">
          <InnerPanel className="p-4 min-w-[8rem]">
            <Loading className="text-sm text-[#3e2731]" />
          </InnerPanel>
        </div>
      </div>
    );
  }

  if (loadError || !payload || !runtime) {
    return (
      <div
        className="relative flex min-h-screen flex-col items-center justify-center gap-2 p-4"
        style={{ paddingTop: safeTop }}
      >
        <MinigameDashboardBackdrop />
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-center text-white">{loadErrorText}</p>
          <Button onClick={handleClose}>
            {t("minigame.dashboard.goBack")}
          </Button>
        </div>
      </div>
    );
  }

  const tokenImages = payload.ui.tokenImages;
  const farmFlowerBalance = gameState.context.state.balance;
  const hasFlowerPurchases = payload.ui.flowerPurchaseItems.length > 0;
  const hasTokenShop = payload.ui.shopItems.length > 0;
  const hasShop = hasFlowerPurchases || hasTokenShop;
  const copy = payload.config.descriptions;
  const marketPick = getPrimaryTradableMarketplaceItem(payload.config);
  /** Adventure iframe is always `https://{slug}.economies.sunflower-land.com`. */
  const hasCustomAdventureLink = true;
  const playerHighscore = Math.max(
    runtime.highscore ?? 0,
    gameState.context.state.minigames?.games?.[payload.portalName]?.highscore ??
      0,
  );

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      style={{ paddingTop: safeTop }}
    >
      <MinigameDashboardBackdrop />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="relative mb-0.5 flex h-[70px] w-full items-center justify-between bg-black/20 pr-10">
          <div className="z-10 pl-4 min-w-0">
            <p className="truncate text-lg text-white text-shadow">
              {copy?.title ?? payload.displayName}
            </p>
            {copy?.subtitle ? (
              <p className="truncate text-xs text-white text-shadow">
                {copy.subtitle}
              </p>
            ) : null}
          </div>

          <div className="z-10 flex flex-col items-end gap-0.5 pr-0.5">
            <div className="flex items-center">
              <img
                src={flowerIcon}
                alt=""
                className="mr-1 w-7 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              <p className="text-xs text-white tabular-nums text-shadow sm:text-sm">
                {formatNumber(farmFlowerBalance, { decimalPlaces: 4 })}
              </p>
            </div>
            <div className="flex items-center">
              <img
                src={getMinigameTokenImage(headerToken, tokenImages)}
                alt=""
                className="mr-1 w-8 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              <p className="text-sm text-white tabular-nums text-shadow">
                {headerBalance.toString()}
              </p>
            </div>
          </div>

          <img
            src={SUNNYSIDE.icons.close}
            className="absolute right-2 flex-none cursor-pointer"
            onClick={handleClose}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              height: `${PIXEL_SCALE * 11}px`,
            }}
            alt=""
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden md:flex-row md:p-2">
          {hasShop && (
            <div className="hidden min-h-0 w-[min(42vw,220px)] shrink-0 md:flex md:flex-col md:gap-2">
              <MinigameShopPanel
                flowerPurchaseItems={payload.ui.flowerPurchaseItems}
                farmFlowerBalance={farmFlowerBalance}
                items={payload.ui.shopItems}
                balances={runtime.balances}
                tokenImages={tokenImages}
                highlightedFlowerId={pendingFlowerItem?.id}
                highlightedShopId={pendingShopItem?.id}
                onFlowerItemClick={onFlowerItemClick}
                onShopItemClick={onShopItemClick}
              />
              {marketPick && (
                <MinigameCurrencyWidget
                  userToken={userToken}
                  marketplaceSlug={payload.portalName ?? slug}
                  marketplaceItemId={marketPick.itemId}
                  marketplaceItemToken={marketPick.tokenKey}
                  tokenImages={tokenImages}
                />
              )}
              <MinigameHighscoreWidget highscore={playerHighscore} />
            </div>
          )}

          <div className="flex min-h-0 min-w-0 flex-1 flex-row gap-2 overflow-y-hidden px-2 pt-2 md:pl-0 md:pr-2 md:pt-0">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden gap-2">
              <MinigameTrophySection
                config={payload.config}
                balances={runtime.balances}
                tokenImages={tokenImages}
                onSelectTrophy={setTrophyDetailToken}
              />
              {!hasShop && (
                <div className="hidden shrink-0 self-start md:block w-full max-w-[min(42vw,220px)]">
                  <MinigameHighscoreWidget highscore={playerHighscore} />
                </div>
              )}
            </div>

            <div className="shrink-0 pr-0.5 pt-0.5 md:pr-1 md:pt-1">
              <MinigameInventoryHud
                shortcutTokens={payload.ui.inventoryShortcutTokens}
                inventoryItems={payload.ui.inventoryItems}
                balances={runtime.balances}
                tokenImages={tokenImages}
                onOpenInventory={openInventory}
                onOpenShop={hasShop ? openMobileShopList : undefined}
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-start px-2 pb-1 md:hidden">
          <div className="w-full max-w-[min(42vw,220px)]">
            <MinigameHighscoreWidget highscore={playerHighscore} />
          </div>
        </div>

        <div
          className="relative z-20 shrink-0 border-t border-black/20 bg-black/10 p-2 backdrop-blur-[2px]"
          style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
          <Button
            className="w-full"
            onClick={() => {
              if (hasCustomAdventureLink) {
                setShowAdventureConfirm(true);
              } else {
                setShowAdventureNoLink(true);
              }
            }}
          >
            {t("minigame.dashboard.adventure")}
          </Button>
        </div>

        <MinigameConfirmPanel
          show={showShopConfirm && !!pendingShopItem}
          title={pendingShopItem?.name ?? t("minigame.dashboard.shop")}
          confirmLabel={t("buy")}
          confirmDisabled={
            !!pendingShopItem &&
            !!runtime &&
            !canAttemptShopPurchase(pendingShopItem, runtime.balances)
          }
          onClose={() => {
            setShowShopConfirm(false);
            setPendingShopItem(null);
            setShopActionError(null);
          }}
          onConfirm={confirmShopPurchase}
        >
          {pendingShopItem && runtime && (
            <MinigameShopDetailBody
              config={payload.config}
              item={pendingShopItem}
              tokenImages={tokenImages}
              balances={runtime.balances}
              shopActionError={shopActionError}
            />
          )}
        </MinigameConfirmPanel>

        <MinigameConfirmPanel
          show={showFlowerConfirm && !!pendingFlowerItem}
          title={t("minigame.dashboard.confirmFlowerTitle")}
          confirmLabel={t("buy")}
          confirmDisabled={
            !pendingFlowerItem ||
            !canAttemptFlowerPurchase(
              pendingFlowerItem.flower,
              farmFlowerBalance,
            )
          }
          onClose={() => {
            setShowFlowerConfirm(false);
            setPendingFlowerItem(null);
            setShopActionError(null);
          }}
          onConfirm={confirmFlowerPurchase}
        >
          {pendingFlowerItem && (
            <MinigameFlowerPurchaseDetailBody
              config={payload.config}
              item={pendingFlowerItem}
              farmBalance={farmFlowerBalance}
              shopActionError={shopActionError}
            />
          )}
        </MinigameConfirmPanel>

        <MinigameConfirmPanel
          show={showAdventureNoLink}
          title={t("minigame.dashboard.adventureNotConfiguredTitle")}
          confirmLabel={t("ok")}
          onClose={() => setShowAdventureNoLink(false)}
          onConfirm={() => setShowAdventureNoLink(false)}
        >
          <p className="text-xs mb-2 whitespace-pre-line text-[#3e2731]">
            {t("minigame.dashboard.adventureNotConfiguredBody")}
          </p>
        </MinigameConfirmPanel>

        <MinigameConfirmPanel
          show={showAdventureConfirm}
          title={t("minigame.dashboard.startAdventureTitle")}
          confirmLabel={t("minigame.dashboard.play")}
          onClose={() => setShowAdventureConfirm(false)}
          onConfirm={() => {
            setShowAdventureConfirm(false);
            setShowPortal(true);
          }}
        >
          <p className="text-xs mb-2 whitespace-pre-line">
            {payload.config.descriptions?.rules ??
              t("minigame.dashboard.rulesFallback")}
          </p>
        </MinigameConfirmPanel>

        <MinigameConfirmPanel
          show={showWelcomeModal}
          title={t("welcome.label")}
          confirmLabel={t("ok")}
          onClose={() => setShowWelcomeModal(false)}
          onConfirm={() => setShowWelcomeModal(false)}
        >
          <p className="text-xs leading-relaxed whitespace-pre-line text-[#3e2731]">
            {copy?.welcome ?? t("minigame.dashboard.welcomeFallback")}
          </p>
        </MinigameConfirmPanel>

        <MinigameConfirmPanel
          show={showActionSyncError}
          title={t("minigame.dashboard.saveFailedTitle")}
          confirmLabel={t("ok")}
          onClose={() => {
            setShowActionSyncError(false);
            setActionSyncError(null);
          }}
          onConfirm={() => {
            setShowActionSyncError(false);
            setActionSyncError(null);
          }}
        >
          <p className="mb-2 text-xs text-[#3e2731]">
            {actionSyncError ?? t("minigame.dashboard.saveFailedFallback")}
          </p>
        </MinigameConfirmPanel>

        <MinigameInventoryModal
          key={inventoryModalKey}
          show={showInventoryModal}
          onClose={() => {
            setShowInventoryModal(false);
            setInventoryFocusToken(null);
          }}
          inventoryItems={payload.ui.inventoryItems}
          balances={runtime.balances}
          tokenImages={tokenImages}
          focusToken={inventoryFocusToken}
        />

        {trophyDetailToken !== null && (
          <MinigameTrophyDetailModal
            token={trophyDetailToken}
            config={payload.config}
            tokenImages={tokenImages}
            onClose={() => setTrophyDetailToken(null)}
          />
        )}

        {hasShop && (
          <MinigameMobileShopModal
            config={payload.config}
            show={showMobileShop}
            phase={mobileShopPhase}
            onClose={() => {
              setShowMobileShop(false);
              setMobileShopPhase("list");
              setPendingShopItem(null);
              setPendingFlowerItem(null);
              setShopActionError(null);
            }}
            onBackToList={() => {
              setMobileShopPhase("list");
              setPendingShopItem(null);
              setPendingFlowerItem(null);
              setShopActionError(null);
            }}
            flowerPurchaseItems={payload.ui.flowerPurchaseItems}
            farmFlowerBalance={farmFlowerBalance}
            items={payload.ui.shopItems}
            balances={runtime.balances}
            tokenImages={tokenImages}
            highlightedFlowerId={pendingFlowerItem?.id}
            highlightedShopId={pendingShopItem?.id}
            onFlowerListClick={onMobileFlowerListPick}
            onShopListClick={onMobileShopListPick}
            detailFlowerItem={pendingFlowerItem}
            detailShopItem={pendingShopItem}
            shopActionError={shopActionError}
            onBuy={confirmMobileShopBuy}
          />
        )}

        {showPortal && (
          <Portal
            portalName={payload.portalName}
            iframeBaseUrl={`https://${payload.slug}.economies.sunflower-land.com`}
            onClose={() => {
              setShowPortal(false);
              setDashboardReloadKey((k) => k + 1);
            }}
          />
        )}
      </div>
    </div>
  );
};
