import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ButtonPanel, ColorPanel, InnerPanel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
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
  capTokenDisplayName,
  getCollectOutputForSlot,
  isProductionSlotConfigured,
  recipeJobKey,
} from "../lib/extractProductionSlots";
import { secondsToString } from "lib/utils/time";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import { MinigameGeneratorRecipesModal } from "./MinigameGeneratorRecipesModal";

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
      const ok = await runStartProduction(slot);
    } finally {
      setStartingRecipeKey(null);
    }
  };

  const handleCollectSlot = useCallback(
    async (
      slot: CapBalanceProductionSlot,
      capToken: string,
      opts?: { useModalError?: boolean; closeRecipesOnSuccess?: boolean },
    ) => {
      if (!isProductionSlotConfigured(slot)) return;
      const k = recipeJobKey(slot);
      const jobId = capJobByRecipeKey[k];
      if (!jobId) return;
      setCollectingRecipeKey(k);
      setInlineCollectError(null);
      setStartError(null);
      try {
        const result = await latestDispatchRef.current({
          actionId: slot.collectActionId,
          itemId: jobId,
        });
        if (!result.ok) {
          if (opts?.useModalError) {
            setStartError(result.error);
          } else {
            setInlineCollectError({ capToken, message: result.error });
          }
          return;
        }
        onRuntimeChange(result.state);
        onRecipeJobChange(slot, undefined);
        if (opts?.closeRecipesOnSuccess) {
          closeRecipesModal();
        }
      } finally {
        setCollectingRecipeKey(null);
      }
    },
    [capJobByRecipeKey, closeRecipesModal, onRecipeJobChange, onRuntimeChange],
  );

  const durationShort = (ms: number) =>
    secondsToString(Math.max(0, Math.floor(ms / 1000)), {
      length: "short",
      removeTrailingZeros: true,
    });

  return (
    <>
      <div className="grid h-full min-h-0 w-full auto-rows-min grid-cols-1 gap-2 overflow-y-auto p-2 md:grid-cols-3">
        {entries.map((entry) => {
          const { capToken, recipes } = entry;
          const configured = recipes.some((r) => isProductionSlotConfigured(r));
          const itemMeta = config.items?.[capToken];
          const placeholderBlurb =
            itemMeta?.description?.trim() ||
            t("minigame.dashboard.production.noRuleConfigured");

          const firstRecipe = recipes[0];
          const singleOut =
            recipes.length === 1 &&
            firstRecipe &&
            isProductionSlotConfigured(firstRecipe)
              ? (getCollectOutputForSlot(config, firstRecipe) ??
                (firstRecipe.outputToken
                  ? { token: firstRecipe.outputToken, amount: 1 }
                  : null))
              : null;

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
                  return { k, progress, remainingMs, out };
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

          const iconBoxBorder = Math.max(1, Math.floor(PIXEL_SCALE / 2));

          const openRecipesForCap = () => {
            setInlineCollectError(null);
            setRecipesModalCapToken(capToken);
          };

          return (
            <div key={capToken} className="min-w-0 w-full">
              <ColorPanel
                type="default"
                className={`relative flex w-full flex-col gap-2 p-2 text-left${
                  configured
                    ? " cursor-pointer hover:brightness-[0.98] active:brightness-95"
                    : ""
                }`}
                role={configured ? "button" : undefined}
                tabIndex={configured ? 0 : undefined}
                aria-label={
                  configured
                    ? t("minigame.dashboard.production.openRecipesAria")
                    : undefined
                }
                onClick={
                  configured
                    ? () => {
                        openRecipesForCap();
                      }
                    : undefined
                }
                onKeyDown={
                  configured
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openRecipesForCap();
                        }
                      }
                    : undefined
                }
              >
                {configured ? (
                  <img
                    src={SUNNYSIDE.icons.chevron_right}
                    alt=""
                    className="pointer-events-none absolute z-[1] opacity-80"
                    style={{
                      top: `${PIXEL_SCALE * 2}px`,
                      right: `${PIXEL_SCALE * 2}px`,
                      width: `${PIXEL_SCALE * 5}px`,
                      height: `${PIXEL_SCALE * 5}px`,
                      imageRendering: "pixelated",
                    }}
                  />
                ) : null}
                <div className="flex min-h-0 w-full flex-row gap-2 pr-7">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center">
                    <img
                      src={getMinigameTokenImage(capToken, tokenImages)}
                      alt=""
                      className="h-full max-w-full object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                    <span
                      className="w-full truncate text-left text-sm font-medium leading-tight whitespace-nowrap"
                      style={{ color: labelStrong }}
                    >
                      {capTokenDisplayName(capToken, config)}
                    </span>
                    {!configured ? (
                      <span
                        className="line-clamp-3 text-left text-[10px] leading-snug opacity-80"
                        style={{ color: labelStrong }}
                      >
                        {placeholderBlurb}
                      </span>
                    ) : hasInlineProduction ? (
                      <div className="flex min-w-0 flex-col gap-2">
                        <div className="flex min-w-0 flex-row flex-wrap items-end gap-3">
                          {producingRuns.map(
                            ({ k, progress, remainingMs, out }) => (
                              <InnerPanel
                                key={k}
                                className="flex w-max max-w-full flex-col gap-1 p-1.5"
                              >
                                <div className="flex flex-row flex-nowrap items-center gap-1.5">
                                  <div
                                    className="flex shrink-0 items-center justify-center"
                                    style={{
                                      width: PIXEL_SCALE * 9,
                                      height: PIXEL_SCALE * 9,
                                      border: `${iconBoxBorder}px solid ${labelStrong}`,
                                      backgroundColor: "#e8dcc8",
                                      borderRadius: 2,
                                      imageRendering: "pixelated",
                                    }}
                                  >
                                    {out ? (
                                      <img
                                        src={getMinigameTokenImage(
                                          out.token,
                                          tokenImages,
                                        )}
                                        alt=""
                                        className="max-h-[78%] max-w-[78%] object-contain"
                                        style={{
                                          imageRendering: "pixelated",
                                        }}
                                      />
                                    ) : null}
                                  </div>
                                  <span
                                    className="text-[10px] font-medium tabular-nums leading-none"
                                    style={{ color: labelStrong }}
                                  >
                                    {durationShort(remainingMs)}
                                  </span>
                                </div>
                                <ResizableBar
                                  type="progress"
                                  percentage={progress}
                                  outerDimensions={{ width: 22, height: 7 }}
                                />
                              </InnerPanel>
                            ),
                          )}
                          {readyToCollectRuns.map(({ k, slot, out }) => (
                            <ButtonPanel
                              key={`ready-${k}`}
                              variant="card"
                              className="flex w-max max-w-full flex-row flex-nowrap items-center gap-1.5 px-2 py-1.5"
                              disabled={collectingRecipeKey === k}
                              onClick={(e) => {
                                e.stopPropagation();
                                void handleCollectSlot(slot, capToken);
                              }}
                            >
                              <div
                                className="flex shrink-0 items-center justify-center"
                                style={{
                                  width: PIXEL_SCALE * 9,
                                  height: PIXEL_SCALE * 9,
                                  border: `${iconBoxBorder}px solid ${labelStrong}`,
                                  backgroundColor: "#e8dcc8",
                                  borderRadius: 2,
                                  imageRendering: "pixelated",
                                }}
                              >
                                {out ? (
                                  <img
                                    src={getMinigameTokenImage(
                                      out.token,
                                      tokenImages,
                                    )}
                                    alt=""
                                    className="max-h-[78%] max-w-[78%] object-contain"
                                    style={{
                                      imageRendering: "pixelated",
                                    }}
                                  />
                                ) : null}
                              </div>
                              <span
                                className="text-xs font-medium leading-tight"
                                style={{ color: labelStrong }}
                              >
                                {t("collect")}
                              </span>
                            </ButtonPanel>
                          ))}
                        </div>
                        {inlineCollectError?.capToken === capToken ? (
                          <p className="text-[10px] leading-snug text-red-700">
                            {inlineCollectError.message}
                          </p>
                        ) : null}
                      </div>
                    ) : singleOut ? (
                      <div
                        className="flex min-w-0 w-full flex-row flex-nowrap items-center gap-1.5 text-xs leading-tight"
                        style={{ color: labelStrong }}
                      >
                        <img
                          src={getMinigameTokenImage(
                            singleOut.token,
                            tokenImages,
                          )}
                          alt=""
                          className="h-4 w-4 shrink-0 object-contain"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <span className="min-w-0 text-left leading-snug">
                          {singleOut.amount}{" "}
                          {capTokenDisplayName(singleOut.token, config)}
                          {" / "}
                          {durationShort(firstRecipe?.msToComplete ?? 0)}
                        </span>
                      </div>
                    ) : (
                      <span
                        className="text-left text-[10px] leading-snug opacity-80"
                        style={{ color: labelStrong }}
                      >
                        {recipes.length === 1
                          ? t(
                              "minigame.dashboard.production.recipesSummarySingular",
                            )
                          : t("minigame.dashboard.production.recipesSummary", {
                              count: recipes.length,
                            })}
                      </span>
                    )}
                  </div>
                </div>
              </ColorPanel>
            </div>
          );
        })}
      </div>

      {recipesModalEntry && recipesModalEntry.recipes.length > 0 && (
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
          onRecipeCollect={(slot) => {
            void handleCollectSlot(slot, recipesModalEntry.capToken, {
              useModalError: true,
              closeRecipesOnSuccess: false,
            });
          }}
        />
      )}
    </>
  );
};
