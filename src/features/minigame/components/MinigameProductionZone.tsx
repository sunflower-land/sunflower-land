import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ResizableBar } from "components/ui/ProgressBar";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type {
  PlayerEconomyConfig,
  PlayerEconomyProcessResult,
  PlayerEconomyRuntimeState,
} from "../lib/types";
import type {
  CapBalanceProductionSlot,
  GeneratorProductionEntry,
} from "../lib/extractProductionSlots";
import {
  getCollectOutputForSlot,
  isDeterministicCollectYield,
  isProductionSlotConfigured,
  recipeJobKey,
  shouldShowCollectRevealModal,
} from "../lib/extractProductionSlots";
import { secondsToString } from "lib/utils/time";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import { MinigameGeneratorRecipesModal } from "./MinigameGeneratorRecipesModal";
import { MinigameCollectRevealModal } from "./MinigameCollectRevealModal";
import type { PlayerEconomyCollectGrant } from "../lib/types";
import { MinigameScaledSpriteImg } from "./MinigameScaledSpriteImg";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";

type Props = {
  entries: GeneratorProductionEntry[];
  config: PlayerEconomyConfig;
  runtime: PlayerEconomyRuntimeState;
  tokenImages: Record<string, string>;
  onRuntimeChange: (next: PlayerEconomyRuntimeState) => void;
  capJobByRecipeKey: Record<string, string | undefined>;
  onRecipeJobChange: (
    slot: CapBalanceProductionSlot,
    jobId: string | undefined,
  ) => void;
  dispatchAction: (input: {
    actionId: string;
    itemId?: string;
    amounts?: Record<string, number>;
    syncCollectWithServer?: boolean;
  }) => Promise<PlayerEconomyProcessResult>;
};

export const MinigameProductionZone: React.FC<Props> = ({
  entries,
  config,
  runtime,
  tokenImages,
  onRuntimeChange,
  capJobByRecipeKey,
  onRecipeJobChange,
  dispatchAction,
}) => {
  const { t } = useAppTranslation();
  const [now, setNow] = useState(() => Date.now());
  const [recipesModalCapToken, setRecipesModalCapToken] = useState<
    string | null
  >(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [startingRecipeKey, setStartingRecipeKey] = useState<string | null>(
    null,
  );
  const [collectingRecipeKey, setCollectingRecipeKey] = useState<string | null>(
    null,
  );
  const [inlineCollectError, setInlineCollectError] = useState<{
    capToken: string;
    message: string;
  } | null>(null);
  const [collectReveal, setCollectReveal] = useState<{
    phase: "loading" | "result" | "error";
    grants: PlayerEconomyCollectGrant[] | null;
    errorMessage: string | null;
    closeRecipesWhenDone: boolean;
  } | null>(null);
  const latestDispatchRef = useRef(dispatchAction);
  latestDispatchRef.current = dispatchAction;

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const recipesModalEntry = useMemo(() => {
    if (!recipesModalCapToken) return null;
    return entries.find((e) => e.capToken === recipesModalCapToken) ?? null;
  }, [entries, recipesModalCapToken]);

  const closeRecipesModal = useCallback(() => {
    setRecipesModalCapToken(null);
    setStartError(null);
    setStartingRecipeKey(null);
    setInlineCollectError(null);
  }, []);

  useEffect(() => {
    if (recipesModalCapToken === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      closeRecipesModal();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [recipesModalCapToken, closeRecipesModal]);

  const runStartProduction = useCallback(
    async (slot: CapBalanceProductionSlot): Promise<boolean> => {
      if (!isProductionSlotConfigured(slot)) return false;
      const result = await latestDispatchRef.current({
        actionId: slot.startActionId,
      });
      if (!result.ok) {
        setStartError(result.error);
        return false;
      }
      onRuntimeChange(result.state);
      if (result.generatorJobId) {
        onRecipeJobChange(slot, result.generatorJobId);
      }
      return true;
    },
    [onRecipeJobChange, onRuntimeChange],
  );

  const handleRecipeStartImmediate = async (slot: CapBalanceProductionSlot) => {
    const key = recipeJobKey(slot);
    setStartingRecipeKey(key);
    setStartError(null);
    try {
      await runStartProduction(slot);
    } finally {
      setStartingRecipeKey(null);
    }
  };

  const handleCollectSlot = useCallback(
    async (
      slot: CapBalanceProductionSlot,
      capToken: string,
      opts?: {
        useModalError?: boolean;
        closeRecipesOnSuccess?: boolean;
        closeRecipesAfterReveal?: boolean;
      },
    ) => {
      if (!isProductionSlotConfigured(slot)) return;
      const k = recipeJobKey(slot);
      const jobId = capJobByRecipeKey[k];
      if (!jobId) return;
      const useReveal = shouldShowCollectRevealModal(config, slot);
      setCollectingRecipeKey(k);
      if (useReveal) {
        setCollectReveal({
          phase: "loading",
          grants: null,
          errorMessage: null,
          closeRecipesWhenDone: opts?.closeRecipesAfterReveal ?? false,
        });
      }
      setInlineCollectError(null);
      setStartError(null);
      try {
        const result = await latestDispatchRef.current({
          actionId: slot.collectActionId,
          itemId: jobId,
          syncCollectWithServer: useReveal,
        });
        if (!result.ok) {
          if (useReveal) {
            setCollectReveal({
              phase: "error",
              grants: null,
              errorMessage: result.error,
              closeRecipesWhenDone: opts?.closeRecipesAfterReveal ?? false,
            });
          } else if (opts?.useModalError) {
            setStartError(result.error);
          } else {
            setInlineCollectError({ capToken, message: result.error });
          }
          return;
        }
        onRuntimeChange(result.state);
        onRecipeJobChange(slot, undefined);
        if (useReveal) {
          setCollectReveal({
            phase: "result",
            grants: result.collectGrants ?? [],
            errorMessage: null,
            closeRecipesWhenDone: opts?.closeRecipesAfterReveal ?? false,
          });
        } else if (opts?.closeRecipesOnSuccess) {
          closeRecipesModal();
        }
      } finally {
        setCollectingRecipeKey(null);
      }
    },
    [
      capJobByRecipeKey,
      closeRecipesModal,
      config,
      onRecipeJobChange,
      onRuntimeChange,
    ],
  );

  const dismissCollectReveal = useCallback(() => {
    setCollectReveal((prev) => {
      if (prev?.phase === "result" && prev.closeRecipesWhenDone) {
        closeRecipesModal();
      }
      return null;
    });
  }, [closeRecipesModal]);

  const durationShort = (ms: number) =>
    secondsToString(Math.max(0, Math.floor(ms / 1000)), {
      length: "short",
      removeTrailingZeros: true,
    });

  return (
    <>
      <div
        className="relative z-10 flex h-full min-h-0 w-full flex-col items-start overflow-y-auto overflow-x-auto"
        style={{
          gap: GRID_WIDTH_PX,
          padding: GRID_WIDTH_PX,
        }}
      >
        {entries.map((entry) => {
          const { capToken, recipes } = entry;
          const configured = recipes.some((r) => isProductionSlotConfigured(r));

          const labelStrong = "#181425";

          const producingRuns = configured
            ? recipes
                .map((slot) => {
                  if (!isProductionSlotConfigured(slot)) return null;
                  const k = recipeJobKey(slot);
                  const jobId = capJobByRecipeKey[k];
                  const job = jobId ? runtime.generating[jobId] : undefined;
                  if (!job || now >= job.completesAt) return null;
                  const denom = job.completesAt - job.startedAt;
                  const progress =
                    denom > 0
                      ? Math.min(
                          100,
                          Math.max(0, ((now - job.startedAt) / denom) * 100),
                        )
                      : 100;
                  const remainingMs = job.completesAt - now;
                  const out =
                    getCollectOutputForSlot(config, slot) ??
                    (slot.outputToken
                      ? { token: slot.outputToken, amount: 1 }
                      : null);
                  const yieldUnknown = !isDeterministicCollectYield(
                    config,
                    slot,
                  );
                  return { k, progress, remainingMs, out, yieldUnknown };
                })
                .filter((x): x is NonNullable<typeof x> => x != null)
            : [];

          const readyToCollectRuns = configured
            ? recipes
                .map((slot) => {
                  if (!isProductionSlotConfigured(slot)) return null;
                  const k = recipeJobKey(slot);
                  const jobId = capJobByRecipeKey[k];
                  const job = jobId ? runtime.generating[jobId] : undefined;
                  if (!job || now < job.completesAt) return null;
                  const out =
                    getCollectOutputForSlot(config, slot) ??
                    (slot.outputToken
                      ? { token: slot.outputToken, amount: 1 }
                      : null);
                  return { k, slot, out };
                })
                .filter((x): x is NonNullable<typeof x> => x != null)
            : [];

          const hasInlineProduction =
            producingRuns.length > 0 || readyToCollectRuns.length > 0;

          const hasReadyToCollect = readyToCollectRuns.length > 0;

          const isCollectingHere =
            collectingRecipeKey != null &&
            recipes.some((slot) => {
              if (!isProductionSlotConfigured(slot)) return false;
              return recipeJobKey(slot) === collectingRecipeKey;
            });

          const collectRevealOpen = collectReveal != null;

          const openRecipesForCap = () => {
            setInlineCollectError(null);
            setRecipesModalCapToken(capToken);
          };

          const generatorSrc = getMinigameTokenImage(capToken, tokenImages);

          const onBuildingClick = () => {
            if (!configured || isCollectingHere) return;
            if (hasReadyToCollect) {
              const first = readyToCollectRuns[0];
              if (first) void handleCollectSlot(first.slot, capToken);
              return;
            }
            openRecipesForCap();
          };

          return (
            <div
              key={capToken}
              className="flex flex-col items-start"
              // style={{ gap: GRID_WIDTH_PX / 2 }}
            >
              <button
                type="button"
                className={
                  configured
                    ? "cursor-pointer border-0 bg-transparent p-0 transition-[filter] hover:brightness-95 active:brightness-90"
                    : "cursor-default border-0 bg-transparent p-0 opacity-75"
                }
                aria-label={
                  configured
                    ? hasReadyToCollect
                      ? t(
                          "minigame.dashboard.production.collectFromBuildingAria",
                        )
                      : t("minigame.dashboard.production.openRecipesAria")
                    : undefined
                }
                disabled={!configured || isCollectingHere || collectRevealOpen}
                onClick={configured ? onBuildingClick : undefined}
              >
                <MinigameScaledSpriteImg
                  key={generatorSrc}
                  src={generatorSrc}
                  alt=""
                  className="pointer-events-none"
                  draggable={false}
                />
              </button>

              {configured && hasInlineProduction ? (
                <div className="flex w-full min-w-0 max-w-sm flex-col gap-2">
                  {producingRuns.map(
                    ({ k, progress, remainingMs, out, yieldUnknown }) => (
                      <div
                        key={k}
                        className="flex w-full min-w-0 flex-row items-center"
                      >
                        <div className="relative shrink-0">
                          <Box
                            hideCount={yieldUnknown}
                            count={new Decimal(out?.amount ?? 0)}
                            image={getMinigameTokenImage(
                              out?.token ?? "",
                              tokenImages,
                            )}
                          />
                          {yieldUnknown ? (
                            <span
                              className="pointer-events-none absolute z-[12] text-[11px] font-bold leading-none yield-text"
                              style={{
                                right: `${PIXEL_SCALE * -5}px`,
                                top: `${PIXEL_SCALE * -5}px`,
                              }}
                            >
                              {"?"}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <ResizableBar
                            type="progress"
                            percentage={progress}
                            outerDimensions={{ width: 18, height: 7 }}
                          />
                          <span
                            className="text-xs  tabular-nums leading-none"
                            style={{ color: labelStrong }}
                          >
                            {durationShort(remainingMs)}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                  {readyToCollectRuns.map(({ k, slot, out }) =>
                    out ? (
                      <div
                        key={`ready-${k}`}
                        className="animate-bounce shrink-0 img-highlight flex items-center"
                        style={{
                          imageRendering: "pixelated",
                        }}
                        aria-hidden
                      >
                        <MinigameScaledSpriteImg
                          key={getMinigameTokenImage(out.token, tokenImages)}
                          src={getMinigameTokenImage(out.token, tokenImages)}
                          alt=""
                          draggable={false}
                        />
                        <span className="yield-text ml-1">
                          {isDeterministicCollectYield(config, slot)
                            ? `+${out.amount}`
                            : "?"}
                        </span>
                      </div>
                    ) : null,
                  )}
                  {inlineCollectError?.capToken === capToken ? (
                    <p className="text-[10px] leading-snug text-red-700">
                      {inlineCollectError.message}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {recipesModalEntry ? (
        <MinigameGeneratorRecipesModal
          show={recipesModalCapToken !== null}
          capToken={recipesModalEntry.capToken}
          recipes={recipesModalEntry.recipes}
          config={config}
          runtime={runtime}
          now={now}
          tokenImages={tokenImages}
          capJobByRecipeKey={capJobByRecipeKey}
          startError={startError}
          startingRecipeKey={startingRecipeKey}
          collectingRecipeKey={collectingRecipeKey}
          onClose={closeRecipesModal}
          onRecipeStart={(slot) => {
            void handleRecipeStartImmediate(slot);
          }}
          interactionLocked={collectReveal != null}
          onRecipeCollect={(slot) => {
            void handleCollectSlot(slot, recipesModalEntry.capToken, {
              useModalError: true,
              closeRecipesOnSuccess: false,
              closeRecipesAfterReveal: true,
            });
          }}
        />
      ) : null}

      {collectReveal ? (
        <MinigameCollectRevealModal
          show
          phase={collectReveal.phase}
          grants={collectReveal.grants}
          errorMessage={collectReveal.errorMessage}
          config={config}
          tokenImages={tokenImages}
          onDismiss={dismissCollectReveal}
        />
      ) : null}
    </>
  );
};
