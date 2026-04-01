import React from "react";
import { createPortal } from "react-dom";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import type {
  BurnRule,
  MinigameConfig,
  MinigameRuntimeState,
} from "../lib/types";
import { formatBurnRuleForDisplay } from "../lib/minigameConfigHelpers";
import {
  capTokenDisplayName,
  formatMinigameDuration,
  getCollectOutputForSlot,
  recipeJobKey,
  type CapBalanceProductionSlot,
} from "../lib/extractProductionSlots";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const INK = "#181425";

const iconSm = {
  height: `${PIXEL_SCALE * 6}px`,
  imageRendering: "pixelated" as const,
};

type Props = {
  show: boolean;
  capToken: string;
  recipes: CapBalanceProductionSlot[];
  config: MinigameConfig;
  runtime: MinigameRuntimeState;
  now: number;
  tokenImages: Record<string, string>;
  capJobByRecipeKey: Record<string, string | undefined>;
  startError?: string | null;
  startingRecipeKey?: string | null;
  collectingRecipeKey?: string | null;
  onClose: () => void;
  onRecipeStart: (slot: CapBalanceProductionSlot) => void;
  onRecipeCollect: (slot: CapBalanceProductionSlot) => void;
};

export const MinigameGeneratorRecipesModal: React.FC<Props> = ({
  show,
  capToken,
  recipes,
  config,
  runtime,
  now,
  tokenImages,
  capJobByRecipeKey,
  startError = null,
  startingRecipeKey = null,
  collectingRecipeKey = null,
  onClose,
  onRecipeStart,
  onRecipeCollect,
}) => {
  const { t } = useAppTranslation();

  if (!show) return null;

  const buildingName = capTokenDisplayName(capToken, config);
  const durationShort = (ms: number) =>
    secondsToString(Math.max(0, Math.floor(ms / 1000)), {
      length: "short",
      removeTrailingZeros: true,
    });

  return createPortal(
    <div
      data-html2canvas-ignore="true"
      className="fixed inset-safe-area z-[65] flex items-center justify-center p-3"
      style={{ background: "rgb(0 0 0 / 56%)" }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-full max-w-full"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <CloseButtonPanel
          className="flex w-[min(96vw,520px)] max-h-[min(85vh,560px)] flex-col overflow-hidden"
          onClose={onClose}
        >
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-1">
            <Label type="default" className="!text-sm  shrink-0">
              {buildingName}
            </Label>
            <Label
              type="transparent"
              className="!w-full !justify-start !px-0 !text-sm !font-medium shrink-0"
              style={{ color: INK }}
            >
              {t("minigame.dashboard.production.whatToProduce")}
            </Label>
            {startError ? (
              <Label type="danger" className="!w-full !justify-start shrink-0">
                {startError}
              </Label>
            ) : null}

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
              {recipes.map((slot) => {
                const key = recipeJobKey(slot);
                const jobId = capJobByRecipeKey[key];
                const job = jobId ? runtime.producing[jobId] : undefined;
                const producing = !!job;
                const ready = producing && now >= job!.completesAt;
                const busy = producing && !ready;
                const starting = startingRecipeKey === key;
                const collecting = collectingRecipeKey === key;

                const out =
                  getCollectOutputForSlot(config, slot) ??
                  (slot.outputToken
                    ? { token: slot.outputToken, amount: 1 }
                    : null);

                const recipeTitle = out
                  ? capTokenDisplayName(out.token, config)
                  : capTokenDisplayName(slot.outputToken, config);

                const progress =
                  busy && job
                    ? Math.min(
                        100,
                        Math.max(
                          0,
                          ((now - job.startedAt) /
                            (job.completesAt - job.startedAt)) *
                            100,
                        ),
                      )
                    : 0;
                const remainingMs = busy && job ? job.completesAt - now : 0;

                const startDef = config.actions[slot.startActionId];
                const burnEntries = startDef?.burn
                  ? Object.entries(startDef.burn)
                  : [];
                const requireEntries = startDef?.require
                  ? Object.entries(startDef.require)
                  : [];

                const clickable =
                  (!producing && !starting) || (ready && !collecting);
                const onCardClick = () => {
                  if (starting || collecting) return;
                  if (ready) {
                    onRecipeCollect(slot);
                    return;
                  }
                  if (!producing) {
                    onRecipeStart(slot);
                  }
                };

                const cardBody = (
                  <div className="flex flex-row items-start gap-3">
                    {out ? (
                      <div
                        className="flex shrink-0 items-center justify-center"
                        style={{
                          width: PIXEL_SCALE * 14,
                          height: PIXEL_SCALE * 14,
                        }}
                      >
                        <img
                          src={getMinigameTokenImage(out.token, tokenImages)}
                          alt=""
                          className="h-full max-w-full object-contain"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1 space-y-2">
                      <p
                        className="text-base  leading-tight"
                        style={{ color: INK }}
                      >
                        {recipeTitle}
                      </p>

                      {busy ? (
                        <div className="flex flex-row flex-wrap items-center gap-2">
                          <ResizableBar
                            type="progress"
                            percentage={progress}
                            outerDimensions={{ width: 22, height: 7 }}
                          />
                          <span
                            className="text-xs  tabular-nums"
                            style={{ color: INK }}
                          >
                            {durationShort(remainingMs)}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1.5"
                          style={{ color: INK }}
                        >
                          {requireEntries.map(([token, rule]) => (
                            <div
                              key={`req-${token}`}
                              className="flex items-center gap-1"
                            >
                              <img
                                src={getMinigameTokenImage(token, tokenImages)}
                                alt=""
                                style={iconSm}
                              />
                              <span className="text-xs  leading-tight">
                                {rule.amount}{" "}
                                {capTokenDisplayName(token, config)}
                              </span>
                            </div>
                          ))}
                          {burnEntries.map(([token, rule]) => (
                            <div
                              key={`burn-${token}`}
                              className="flex items-center gap-1"
                            >
                              <img
                                src={getMinigameTokenImage(token, tokenImages)}
                                alt=""
                                style={iconSm}
                              />
                              <span className="text-xs  leading-tight">
                                {formatBurnRuleForDisplay(rule as BurnRule)}{" "}
                                {capTokenDisplayName(token, config)}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-center gap-1">
                            <img
                              src={SUNNYSIDE.icons.timer}
                              alt=""
                              style={iconSm}
                            />
                            <span className="text-xs leading-tight">
                              {formatMinigameDuration(slot.msToComplete)}
                            </span>
                          </div>
                        </div>
                      )}

                      {ready ? (
                        <p className="text-[10px]  uppercase tracking-wide text-green-800">
                          {t("minigame.dashboard.production.tapToCollect")}
                        </p>
                      ) : null}
                      {!producing && !starting ? (
                        <p className="text-[10px] font-medium opacity-75">
                          {t("minigame.dashboard.production.tapToStart")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );

                if (busy) {
                  return (
                    <InnerPanel key={key} className="p-2">
                      {cardBody}
                    </InnerPanel>
                  );
                }

                return (
                  <ButtonPanel
                    key={key}
                    variant="card"
                    disabled={starting || collecting}
                    className="flex flex-col !items-stretch p-2 text-left"
                    onClick={() => {
                      if (clickable) onCardClick();
                    }}
                    {...(clickable
                      ? {
                          tabIndex: 0,
                          onKeyDown: (
                            e: React.KeyboardEvent<HTMLDivElement>,
                          ) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onCardClick();
                            }
                          },
                          role: "button" as const,
                        }
                      : {})}
                  >
                    {cardBody}
                  </ButtonPanel>
                );
              })}
            </div>
          </div>
        </CloseButtonPanel>
      </div>
    </div>,
    document.body,
  );
};
