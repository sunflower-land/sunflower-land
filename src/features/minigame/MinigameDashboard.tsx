import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router";
import { useActor } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components/Loading";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import { useSafeAreaPaddingTop } from "lib/utils/hooks/useSafeAreaPaddingTop";
import { Portal } from "features/world/ui/portals/Portal";
import { loadMinigameDashboard } from "./lib/loadMinigameDashboard";
import {
  postMinigameActionedEvent,
  runtimeStateFromActionResponse,
} from "./lib/minigameSessionApi";
import { processMinigameAction } from "./lib/processMinigameAction";
import type { MinigameProcessResult, MinigameRuntimeState } from "./lib/types";
import type {
  MinigameDashboardData,
  MinigameShopItemUi,
} from "./lib/minigameDashboardTypes";
import { getMinigameTokenImage } from "./lib/minigameTokenIcons";
import {
  canAttemptShopPurchase,
  isShopItemBoughtOrDisabled,
} from "./lib/minigameShopAvailability";
import { MinigameShopPanel } from "./components/MinigameShopPanel";
import { MinigameShopDetailBody } from "./components/MinigameShopDetailBody";
import { MinigameMobileShopModal } from "./components/MinigameMobileShopModal";
import { MinigameInventoryHud } from "./components/MinigameInventoryHud";
import { MinigameConfirmPanel } from "./components/MinigameConfirmPanel";
import { MinigameInventoryModal } from "./components/MinigameInventoryModal";
import { ChickenRescueBookmatchedBackdrop } from "./components/ChickenRescueBookmatchedBackdrop";
import { MinigameProductionZone } from "./components/MinigameProductionZone";
import {
  buildCapJobByRecipeKey,
  getProductionZoneEntries,
  getShopPurchaseProductionPreview,
  recipeJobKey,
  type CapBalanceProductionSlot,
} from "./lib/extractProductionSlots";
import { cloneMinigameRuntimeState } from "./lib/processMinigameAction";
import { hasFeatureAccess } from "lib/flags";
import { isTokenMinigameDashboardSlug } from "./lib/tokenMinigameDashboardSlugs";
import { MinigameCurrencyWidget } from "./components/MinigameCurrencyWidget";
import {
  getPrimaryTradableMarketplaceItem,
  mergeRuntimeWithInitialBalances,
} from "./lib/minigameConfigHelpers";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { MinigameLoadError } from "./lib/minigameDashboardTypes";

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
  const tokenMinigamesBlocked =
    isTokenMinigameDashboardSlug(slug) &&
    !hasFeatureAccess(gameState.context.state, "TOKEN_MINIGAMES");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<MinigameLoadError | null>(null);
  const [payload, setPayload] = useState<MinigameDashboardData | null>(null);
  const [runtime, setRuntime] = useState<MinigameRuntimeState | null>(null);

  const [pendingShopItem, setPendingShopItem] =
    useState<MinigameShopItemUi | null>(null);
  const [showShopConfirm, setShowShopConfirm] = useState(false);
  const [shopActionError, setShopActionError] = useState<string | null>(null);

  const [showAdventureConfirm, setShowAdventureConfirm] = useState(false);
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

  const [capJobByRecipeKey, setCapJobByRecipeKey] = useState<
    Record<string, string | undefined>
  >({});
  const payloadInitRef = useRef(false);
  const runtimeRef = useRef<MinigameRuntimeState | null>(null);
  const capJobByRecipeKeyRef = useRef<Record<string, string | undefined>>({});
  /** Bumped when each minigame POST starts; stale responses must not overwrite newer optimistic state. */
  const minigameRemoteActionSeqRef = useRef(0);
  const dashboardMountedRef = useRef(true);
  /** Bumped when the minigame iframe closes so dashboard data is refetched. */
  const [dashboardReloadKey, setDashboardReloadKey] = useState(0);

  const [showActionSyncError, setShowActionSyncError] = useState(false);
  const [actionSyncError, setActionSyncError] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const applyRuntime = useCallback((next: MinigameRuntimeState | null) => {
    runtimeRef.current = next;
    setRuntime(next);
  }, []);

  useEffect(() => {
    dashboardMountedRef.current = true;
    return () => {
      dashboardMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    capJobByRecipeKeyRef.current = capJobByRecipeKey;
  }, [capJobByRecipeKey]);

  useEffect(() => {
    payloadInitRef.current = false;
    queueMicrotask(() => {
      setCapJobByRecipeKey({});
    });
  }, [slug]);

  useEffect(() => {
    if (!payload) return;
    if (payloadInitRef.current) return;
    payloadInitRef.current = true;
    queueMicrotask(() => {
      setCapJobByRecipeKey(
        buildCapJobByRecipeKey(payload.config, payload.state),
      );
    });
  }, [payload]);

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
    if (!runtime) return;
    queueMicrotask(() => {
      setCapJobByRecipeKey((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          const id = next[key];
          if (id && !runtime.producing[id]) {
            next[key] = undefined;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    });
  }, [runtime]);

  const productionEntries = useMemo(
    () => (payload ? getProductionZoneEntries(payload.config) : []),
    [payload],
  );

  const shopProductionPreview = useMemo(() => {
    if (!payload || !pendingShopItem) return null;
    return getShopPurchaseProductionPreview(
      payload.config,
      pendingShopItem.actionId,
    );
  }, [payload, pendingShopItem]);

  const onRecipeJobChange = useCallback(
    (slot: CapBalanceProductionSlot, jobId: string | undefined) => {
      const key = recipeJobKey(slot);
      setCapJobByRecipeKey((prev) => ({ ...prev, [key]: jobId }));
    },
    [],
  );

  const runMinigameAction = useCallback(
    async (input: {
      actionId: string;
      itemId?: string;
      amounts?: Record<string, number>;
    }): Promise<MinigameProcessResult> => {
      if (!payload)
        return { ok: false, error: t("minigame.dashboard.error.noSession") };

      const prev = runtimeRef.current;
      if (!prev)
        return { ok: false, error: t("minigame.dashboard.error.noState") };

      const local = processMinigameAction(payload.config, prev, {
        ...input,
        now: Date.now(),
      });
      if (!local.ok) return local;

      if (!CONFIG.API_URL) {
        return local;
      }

      if (!userToken || farmId == null) {
        return { ok: false, error: t("minigame.dashboard.signInToAction") };
      }

      const snapshotRuntime = cloneMinigameRuntimeState(prev);
      const snapshotCapJobs = { ...capJobByRecipeKeyRef.current };
      const cfg = payload.config;

      void (async () => {
        const remoteSeq = ++minigameRemoteActionSeqRef.current;
        try {
          const data = await postMinigameActionedEvent({
            farmId,
            userToken,
            portalId: payload.portalName,
            action: input.actionId,
            itemId: input.itemId,
            amounts: input.amounts,
          });
          const next = runtimeStateFromActionResponse(data.minigame);
          if (!dashboardMountedRef.current) return;
          if (remoteSeq !== minigameRemoteActionSeqRef.current) return;
          applyRuntime(mergeRuntimeWithInitialBalances(cfg, next));
          setCapJobByRecipeKey(buildCapJobByRecipeKey(cfg, next));
        } catch (e) {
          if (!dashboardMountedRef.current) return;
          if (remoteSeq !== minigameRemoteActionSeqRef.current) return;
          applyRuntime(snapshotRuntime);
          setCapJobByRecipeKey(snapshotCapJobs);
          setActionSyncError(
            e instanceof Error
              ? e.message
              : t("minigame.dashboard.actionFailed"),
          );
          setShowActionSyncError(true);
        }
      })();

      return { ok: true, state: local.state, producingId: local.producingId };
    },
    [payload, userToken, farmId, applyRuntime, t],
  );

  useEffect(() => {
    if (tokenMinigamesBlocked) {
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
      payloadInitRef.current = false;
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
    tokenMinigamesBlocked,
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
      if (showMobileShop) {
        setShowMobileShop(false);
        setMobileShopPhase("list");
        setPendingShopItem(null);
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
    showAdventureConfirm,
    showInventoryModal,
    showPortal,
    showMobileShop,
    showShopConfirm,
    showActionSyncError,
    showWelcomeModal,
  ]);

  const openMobileShopList = useCallback(() => {
    setShopActionError(null);
    setPendingShopItem(null);
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
    if (isShopItemBoughtOrDisabled(item, runtime.balances)) {
      return;
    }
    setShopActionError(null);
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
    if (isShopItemBoughtOrDisabled(item, runtime.balances)) {
      return;
    }
    setShopActionError(null);
    setPendingShopItem(item);
    setMobileShopPhase("detail");
  };

  const confirmShopPurchase = () => {
    if (!payload || !pendingShopItem) return;
    const prev = runtimeRef.current;
    if (!prev) return;
    if (!canAttemptShopPurchase(pendingShopItem, prev.balances)) return;

    const local = processMinigameAction(payload.config, prev, {
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

    const snapshotRuntime = cloneMinigameRuntimeState(prev);
    const snapshotCapJobs = { ...capJobByRecipeKeyRef.current };
    const cfg = payload.config;
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
        const data = await postMinigameActionedEvent({
          farmId,
          userToken,
          portalId: payload.portalName,
          action: shopActionId,
        });
        const next = runtimeStateFromActionResponse(data.minigame);
        if (!dashboardMountedRef.current) return;
        if (remoteSeq !== minigameRemoteActionSeqRef.current) return;
        applyRuntime(mergeRuntimeWithInitialBalances(cfg, next));
        setCapJobByRecipeKey(buildCapJobByRecipeKey(cfg, next));
      } catch (e) {
        if (!dashboardMountedRef.current) return;
        if (remoteSeq !== minigameRemoteActionSeqRef.current) return;
        applyRuntime(snapshotRuntime);
        setCapJobByRecipeKey(snapshotCapJobs);
        setActionSyncError(
          e instanceof Error ? e.message : t("minigame.dashboard.actionFailed"),
        );
        setShowActionSyncError(true);
      }
    })();
  };

  const headerToken = payload?.ui.headerBalanceToken ?? "";
  const headerBalance =
    runtime && headerToken
      ? new Decimal(runtime.balances[headerToken] ?? 0)
      : new Decimal(0);

  const useChickenRescueShell =
    (payload?.ui.visualTheme ??
      (slug === "chicken-rescue-v2" ? "chicken-rescue" : "")) ===
    "chicken-rescue";

  const loadErrorText =
    loadError === null
      ? null
      : loadError.kind === "message"
        ? loadError.text
        : loadError.kind === "unknown_minigame"
          ? t("minigame.dashboard.unknownMinigame", { slug: loadError.slug })
          : t("minigame.dashboard.signInToLoad");

  if (tokenMinigamesBlocked) {
    return (
      <div
        className={classNames(
          "relative min-h-screen flex flex-col items-center justify-center gap-2 p-4",
          !useChickenRescueShell && "bg-[#63c74d]",
        )}
        style={{
          paddingTop: safeTop,
          ...(useChickenRescueShell ? { backgroundColor: "#8fbc8f" } : {}),
        }}
      >
        {useChickenRescueShell && <ChickenRescueBookmatchedBackdrop />}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-center text-white px-2">
            {t("minigame.dashboard.tokenMinigamesNotAvailable")}
          </p>
          <Button onClick={handleClose}>
            {t("minigame.dashboard.goBack")}
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={classNames(
          "relative min-h-screen flex flex-col items-center justify-center p-4",
          !useChickenRescueShell && "bg-[#63c74d]",
        )}
        style={{
          paddingTop: safeTop,
          ...(useChickenRescueShell ? { backgroundColor: "#8fbc8f" } : {}),
        }}
      >
        {useChickenRescueShell && <ChickenRescueBookmatchedBackdrop />}
        <div className="relative z-10 flex flex-1 items-center justify-center w-full">
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
        className={classNames(
          "relative min-h-screen flex flex-col items-center justify-center gap-2 p-4",
          !useChickenRescueShell && "bg-[#63c74d]",
        )}
        style={{
          paddingTop: safeTop,
          ...(useChickenRescueShell ? { backgroundColor: "#8fbc8f" } : {}),
        }}
      >
        {useChickenRescueShell && <ChickenRescueBookmatchedBackdrop />}
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
  const hasShop = payload.ui.shopItems.length > 0;
  const copy = payload.config.descriptions;
  const marketPick = getPrimaryTradableMarketplaceItem(payload.config);

  return (
    <div
      className={classNames(
        "relative flex flex-col h-screen w-full overflow-hidden",
        !useChickenRescueShell && "bg-[#8fbc8f]",
      )}
      style={{
        paddingTop: safeTop,
        ...(useChickenRescueShell ? { backgroundColor: "#8fbc8f" } : {}),
      }}
    >
      {useChickenRescueShell && <ChickenRescueBookmatchedBackdrop />}
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

          <div className="z-10 flex items-center">
            <img
              src={getMinigameTokenImage(headerToken, tokenImages)}
              alt=""
              className="mr-1 w-8 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            <p className="text-sm text-white tabular-nums">
              {headerBalance.toString()}
            </p>
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
                items={payload.ui.shopItems}
                balances={runtime.balances}
                tokenImages={tokenImages}
                highlightedId={pendingShopItem?.id}
                onItemClick={onShopItemClick}
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
            </div>
          )}

          <div className="flex min-h-0 min-w-0 flex-1 flex-row gap-2 overflow-y-hidden px-2 pt-2 md:pl-0 md:pr-2 md:pt-0">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <MinigameProductionZone
                entries={productionEntries}
                config={payload.config}
                runtime={runtime}
                tokenImages={tokenImages}
                onRuntimeChange={(next) => applyRuntime(next)}
                capJobByRecipeKey={capJobByRecipeKey}
                onRecipeJobChange={onRecipeJobChange}
                dispatchAction={runMinigameAction}
              />
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

        <div
          className="relative z-20 shrink-0 border-t border-black/20 bg-black/10 p-2 backdrop-blur-[2px]"
          style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
          <Button
            className="w-full"
            onClick={() => setShowAdventureConfirm(true)}
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
              shopProductionPreview={shopProductionPreview}
              tokenImages={tokenImages}
              balances={runtime.balances}
              shopActionError={shopActionError}
            />
          )}
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

        {hasShop && (
          <MinigameMobileShopModal
            config={payload.config}
            show={showMobileShop}
            phase={mobileShopPhase}
            onClose={() => {
              setShowMobileShop(false);
              setMobileShopPhase("list");
              setPendingShopItem(null);
              setShopActionError(null);
            }}
            onBackToList={() => {
              setMobileShopPhase("list");
              setPendingShopItem(null);
              setShopActionError(null);
            }}
            items={payload.ui.shopItems}
            balances={runtime.balances}
            tokenImages={tokenImages}
            highlightedId={pendingShopItem?.id}
            onListItemClick={onMobileShopListPick}
            detailItem={pendingShopItem}
            shopProductionPreview={shopProductionPreview}
            shopActionError={shopActionError}
            onBuy={confirmShopPurchase}
          />
        )}

        {showPortal && (
          <Portal
            portalName={payload.portalName}
            playUrl={payload.playUrl}
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
