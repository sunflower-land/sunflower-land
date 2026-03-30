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
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components/Loading";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
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
import { canAffordShopItem } from "./lib/canAffordShopItem";
import { MinigameShopPanel } from "./components/MinigameShopPanel";
import { MinigameShopDetailBody } from "./components/MinigameShopDetailBody";
import { MinigameMobileShopModal } from "./components/MinigameMobileShopModal";
import { MinigameInventoryHud } from "./components/MinigameInventoryHud";
import { MinigameConfirmPanel } from "./components/MinigameConfirmPanel";
import { MinigameInventoryModal } from "./components/MinigameInventoryModal";
import { ChickenRescueBookmatchedBackdrop } from "./components/ChickenRescueBookmatchedBackdrop";
import { MinigameProductionZone } from "./components/MinigameProductionZone";
import {
  buildCapJobByCapToken,
  extractCapBalanceProductionSlots,
  getShopPurchaseProductionPreview,
} from "./lib/extractProductionSlots";
import { cloneMinigameRuntimeState } from "./lib/processMinigameAction";

export const MinigameDashboard: React.FC = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const safeTop = useSafeAreaPaddingTop(12);

  const { gameService } = useContext(GameContext);
  const [gameState] = useActor(gameService);
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const farmId = gameState.context.farmId;
  const userToken = authState.context.user.rawToken as string | undefined;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [payload, setPayload] = useState<MinigameDashboardData | null>(null);
  const [runtime, setRuntime] = useState<MinigameRuntimeState | null>(null);

  const [pendingShopItem, setPendingShopItem] =
    useState<MinigameShopItemUi | null>(null);
  const [showShopConfirm, setShowShopConfirm] = useState(false);
  const [shopActionError, setShopActionError] = useState<string | null>(null);

  const [showAdventureConfirm, setShowAdventureConfirm] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [inventoryFocusToken, setInventoryFocusToken] = useState<string | null>(
    null,
  );

  const [showMobileShop, setShowMobileShop] = useState(false);
  const [mobileShopPhase, setMobileShopPhase] = useState<
    "list" | "detail"
  >("list");

  const [capJobByCapToken, setCapJobByCapToken] = useState<
    Record<string, string | undefined>
  >({});
  const payloadInitRef = useRef(false);
  const runtimeRef = useRef<MinigameRuntimeState | null>(null);
  const capJobByCapTokenRef = useRef<Record<string, string | undefined>>({});
  const dashboardMountedRef = useRef(true);
  /** Bumped when the minigame iframe closes so dashboard data is refetched. */
  const [dashboardReloadKey, setDashboardReloadKey] = useState(0);

  const [showActionSyncError, setShowActionSyncError] = useState(false);
  const [actionSyncError, setActionSyncError] = useState<string | null>(null);

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
    capJobByCapTokenRef.current = capJobByCapToken;
  }, [capJobByCapToken]);

  useEffect(() => {
    payloadInitRef.current = false;
    setCapJobByCapToken({});
  }, [slug]);

  useEffect(() => {
    if (!payload) return;
    if (payloadInitRef.current) return;
    payloadInitRef.current = true;
    setCapJobByCapToken(
      buildCapJobByCapToken(
        payload.config,
        payload.productionCollectByStartId,
        payload.state,
      ),
    );
  }, [payload]);

  useEffect(() => {
    if (!runtime) return;
    setCapJobByCapToken((prev) => {
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
  }, [runtime]);

  const productionSlots = useMemo(
    () =>
      payload
        ? extractCapBalanceProductionSlots(
            payload.config,
            payload.productionCollectByStartId,
          )
        : [],
    [payload],
  );

  const shopProductionPreview = useMemo(() => {
    if (!payload || !pendingShopItem) return null;
    return getShopPurchaseProductionPreview(
      payload.config,
      payload.productionCollectByStartId,
      pendingShopItem.actionId,
    );
  }, [payload, pendingShopItem]);

  const onCapJobChange = useCallback(
    (capToken: string, jobId: string | undefined) => {
      setCapJobByCapToken((prev) => ({ ...prev, [capToken]: jobId }));
    },
    [],
  );

  const runMinigameAction = useCallback(
    async (input: {
      actionId: string;
      itemId?: string;
      amounts?: Record<string, number>;
    }): Promise<MinigameProcessResult> => {
      if (!payload) return { ok: false, error: "No session" };

      const prev = runtimeRef.current;
      if (!prev) return { ok: false, error: "No state" };

      const local = processMinigameAction(payload.config, prev, {
        ...input,
        now: Date.now(),
      });
      if (!local.ok) return local;

      if (!CONFIG.API_URL) {
        return local;
      }

      if (!userToken || farmId == null) {
        return { ok: false, error: "Sign in to perform this action." };
      }

      const snapshotRuntime = cloneMinigameRuntimeState(prev);
      const snapshotCapJobs = { ...capJobByCapTokenRef.current };
      const cfg = payload.config;
      const collectByStartId = payload.productionCollectByStartId;

      void (async () => {
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
          applyRuntime(next);
          setCapJobByCapToken(
            buildCapJobByCapToken(cfg, collectByStartId, next),
          );
        } catch (e) {
          if (!dashboardMountedRef.current) return;
          applyRuntime(snapshotRuntime);
          setCapJobByCapToken(snapshotCapJobs);
          setActionSyncError(
            e instanceof Error ? e.message : "Action failed",
          );
          setShowActionSyncError(true);
        }
      })();

      return { ok: true, state: local.state, producingId: local.producingId };
    },
    [payload, userToken, farmId, applyRuntime],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      const creds =
        userToken && farmId != null
          ? { userToken, farmId }
          : null;
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
  }, [slug, userToken, farmId, applyRuntime, dashboardReloadKey]);

  const handleClose = useCallback(() => {
    navigate(-1);
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
  ]);

  const openMobileShopList = useCallback(() => {
    setShopActionError(null);
    setPendingShopItem(null);
    setShowMobileShop(true);
    setMobileShopPhase("list");
  }, []);

  const openInventory = useCallback((focusToken?: string) => {
    setInventoryFocusToken(focusToken ?? null);
    setShowInventoryModal(true);
  }, []);

  const onShopItemClick = (item: MinigameShopItemUi) => {
    if (!runtime) return;
    const lockKey = item.ownedBalanceToken;
    if (lockKey && (runtime.balances[lockKey] ?? 0) >= 1) {
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
    const lockKey = item.ownedBalanceToken;
    if (lockKey && (runtime.balances[lockKey] ?? 0) >= 1) {
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
    if (!canAffordShopItem(pendingShopItem, prev.balances)) return;

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
      setShopActionError("Sign in to perform this action.");
      return;
    }

    const snapshotRuntime = cloneMinigameRuntimeState(prev);
    const snapshotCapJobs = { ...capJobByCapTokenRef.current };
    const cfg = payload.config;
    const collectByStartId = payload.productionCollectByStartId;
    const shopActionId = pendingShopItem.actionId;

    applyRuntime(local.state);
    setShowShopConfirm(false);
    setShowMobileShop(false);
    setMobileShopPhase("list");
    setPendingShopItem(null);
    setShopActionError(null);

    void (async () => {
      try {
        const data = await postMinigameActionedEvent({
          farmId,
          userToken,
          portalId: payload.portalName,
          action: shopActionId,
        });
        const next = runtimeStateFromActionResponse(data.minigame);
        if (!dashboardMountedRef.current) return;
        applyRuntime(next);
        setCapJobByCapToken(
          buildCapJobByCapToken(cfg, collectByStartId, next),
        );
      } catch (e) {
        if (!dashboardMountedRef.current) return;
        applyRuntime(snapshotRuntime);
        setCapJobByCapToken(snapshotCapJobs);
        setActionSyncError(
          e instanceof Error ? e.message : "Action failed",
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

  const isChickenRescue = slug === "chicken-rescue-v2";

  if (loading) {
    return (
      <div
        className={classNames(
          "relative min-h-screen flex flex-col items-center justify-center p-4",
          !isChickenRescue && "bg-[#63c74d]",
        )}
        style={{
          paddingTop: safeTop,
          ...(isChickenRescue ? { backgroundColor: "#8fbc8f" } : {}),
        }}
      >
        {isChickenRescue && <ChickenRescueBookmatchedBackdrop />}
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
          !isChickenRescue && "bg-[#63c74d]",
        )}
        style={{
          paddingTop: safeTop,
          ...(isChickenRescue ? { backgroundColor: "#8fbc8f" } : {}),
        }}
      >
        {isChickenRescue && <ChickenRescueBookmatchedBackdrop />}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-center text-white">{loadError}</p>
          <Button onClick={handleClose}>Go back</Button>
        </div>
      </div>
    );
  }

  const tokenImages = payload.ui.tokenImages;
  const hasShop = payload.ui.shopItems.length > 0;

  return (
    <div
      className={classNames(
        "relative flex flex-col h-screen w-full overflow-hidden",
        !isChickenRescue && "bg-[#8fbc8f]",
      )}
      style={{
        paddingTop: safeTop,
        ...(isChickenRescue ? { backgroundColor: "#8fbc8f" } : {}),
      }}
    >
      {isChickenRescue && <ChickenRescueBookmatchedBackdrop />}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-2 bg-[#3d3d3d] px-2 py-2 text-white md:px-3">
        <h1 className="min-w-0 flex-1 truncate text-center text-sm md:text-left">
          {payload.displayName}
        </h1>
        <Label
          type="warning"
          className="shrink-0"
          secondaryIcon={getMinigameTokenImage(headerToken, tokenImages)}
        >
          <span className="tabular-nums">{headerBalance.toString()}</span>
        </Label>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden md:flex-row md:p-2">
        {hasShop && (
          <div className="hidden min-h-0 w-[min(42vw,220px)] shrink-0 md:block">
            <MinigameShopPanel
              items={payload.ui.shopItems}
              balances={runtime.balances}
              tokenImages={tokenImages}
              highlightedId={pendingShopItem?.id}
              onItemClick={onShopItemClick}
            />
          </div>
        )}

        <div className="flex min-h-0 min-w-0 flex-1 flex-row gap-2 overflow-hidden px-2 pt-2 md:px-0 md:pt-0">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <MinigameProductionZone
              slots={productionSlots}
              config={payload.config}
              runtime={runtime}
              tokenImages={tokenImages}
              onRuntimeChange={(next) => applyRuntime(next)}
              capJobByCapToken={capJobByCapToken}
              onCapJobChange={onCapJobChange}
              dispatchAction={runMinigameAction}
            />
          </div>

          <div className="shrink-0 pt-0.5 md:pt-1">
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
        className="sticky bottom-0 z-20 shrink-0 border-t border-black/25 bg-[#3d3d3d]/95 p-2 backdrop-blur-sm"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <Button
          className="w-full"
          onClick={() => setShowAdventureConfirm(true)}
        >
          Adventure
        </Button>
      </div>

      <MinigameConfirmPanel
        show={showShopConfirm && !!pendingShopItem}
        title={pendingShopItem?.name ?? "Shop"}
        confirmLabel="Buy"
        confirmDisabled={
          !!pendingShopItem &&
          !!runtime &&
          !canAffordShopItem(pendingShopItem, runtime.balances)
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
        title="Start adventure?"
        confirmLabel="Play"
        onClose={() => setShowAdventureConfirm(false)}
        onConfirm={() => {
          setShowAdventureConfirm(false);
          setShowPortal(true);
        }}
      >
        <p className="text-xs mb-2">
          Opens the minigame in fullscreen. You can close it from inside the
          game when you are done.
        </p>
      </MinigameConfirmPanel>

      <MinigameConfirmPanel
        show={showActionSyncError}
        title="Couldn't save"
        confirmLabel="OK"
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
          {actionSyncError ??
            "Something went wrong. Your last action was reverted."}
        </p>
      </MinigameConfirmPanel>

      <MinigameInventoryModal
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
