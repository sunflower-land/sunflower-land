import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { ResizableBar } from "components/ui/ProgressBar";
import { ColorPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type {
  MinigameConfig,
  MinigameProcessResult,
  MinigameRuntimeState,
} from "../lib/types";
import type { CapBalanceProductionSlot } from "../lib/extractProductionSlots";
import {
  capTokenDisplayName,
  getCollectOutputForSlot,
} from "../lib/extractProductionSlots";
import { secondsToString } from "lib/utils/time";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import { MinigameProductionModal } from "./MinigameProductionModal";

type ModalVariant = "start" | "producing" | "collect" | null;

type Props = {
  slots: CapBalanceProductionSlot[];
  config: MinigameConfig;
  runtime: MinigameRuntimeState;
  tokenImages: Record<string, string>;
  onRuntimeChange: (next: MinigameRuntimeState) => void;
  capJobByCapToken: Record<string, string | undefined>;
  onCapJobChange: (capToken: string, jobId: string | undefined) => void;
  dispatchAction: (input: {
    actionId: string;
    itemId?: string;
    amounts?: Record<string, number>;
  }) => Promise<MinigameProcessResult>;
};

export const MinigameProductionZone: React.FC<Props> = ({
  slots,
  config,
  runtime,
  tokenImages,
  onRuntimeChange,
  capJobByCapToken,
  onCapJobChange,
  dispatchAction,
}) => {
  const { t } = useAppTranslation();
  const [now, setNow] = useState(() => Date.now());
  const [activeSlot, setActiveSlot] = useState<CapBalanceProductionSlot | null>(
    null,
  );
  const [modalVariant, setModalVariant] = useState<ModalVariant>(null);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const visibleSlots = slots.filter(
    (s) => (runtime.balances[s.capToken] ?? 0) > 0,
  );

  const closeModal = useCallback(() => {
    setActiveSlot(null);
    setModalVariant(null);
    setStartError(null);
  }, []);

  useEffect(() => {
    if (modalVariant === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      closeModal();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [modalVariant, closeModal]);

  const openStartModal = (slot: CapBalanceProductionSlot) => {
    setActiveSlot(slot);
    setModalVariant("start");
    setStartError(null);
  };

  const openProducingModal = (slot: CapBalanceProductionSlot) => {
    setActiveSlot(slot);
    setModalVariant("producing");
    setStartError(null);
  };

  const openCollectModal = (slot: CapBalanceProductionSlot) => {
    setActiveSlot(slot);
    setModalVariant("collect");
    setStartError(null);
  };

  const handleStart = async () => {
    if (!activeSlot) return;
    const result = await dispatchAction({
      actionId: activeSlot.startActionId,
    });
    if (!result.ok) {
      setStartError(result.error);
      return;
    }
    onRuntimeChange(result.state);
    if (result.producingId) {
      onCapJobChange(activeSlot.capToken, result.producingId);
    }
    closeModal();
  };

  const handleCollect = async () => {
    if (!activeSlot) return;
    const jobId = capJobByCapToken[activeSlot.capToken];
    if (!jobId) {
      closeModal();
      return;
    }
    const result = await dispatchAction({
      actionId: activeSlot.collectActionId,
      itemId: jobId,
    });
    if (!result.ok) {
      setStartError(result.error);
      return;
    }
    onRuntimeChange(result.state);
    onCapJobChange(activeSlot.capToken, undefined);
    closeModal();
  };

  const activeJob =
    activeSlot && capJobByCapToken[activeSlot.capToken]
      ? runtime.producing[capJobByCapToken[activeSlot.capToken]!]
      : null;

  const durationShort = (ms: number) =>
    secondsToString(Math.max(0, Math.floor(ms / 1000)), {
      length: "short",
      removeTrailingZeros: true,
    });

  return (
    <>
      <div className="grid h-full min-h-0 w-full auto-rows-min grid-cols-1 gap-2 overflow-y-auto p-2 md:grid-cols-3">
        {visibleSlots.map((slot) => {
          const jobId = capJobByCapToken[slot.capToken];
          const job = jobId ? runtime.producing[jobId] : undefined;
          const producing = !!job;
          const ready = producing && now >= job!.completesAt;
          const progress =
            producing && job && !ready
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
          const remainingMs =
            producing && job && !ready ? job.completesAt - now : 0;

          const outputPreview = getCollectOutputForSlot(config, slot) ?? {
            token: slot.outputToken,
            amount: 1,
          };

          const produceDurationLabel = durationShort(slot.msToComplete);
          const remainingLabel = durationShort(remainingMs);

          const panelType = !producing
            ? "default"
            : ready
              ? "success"
              : "formula";
          const labelMuted =
            panelType === "default" ? "#3e2731" : "rgba(255,255,255,0.82)";
          const labelStrong = panelType === "default" ? "#181425" : "#ffffff";

          return (
            <div key={slot.capToken} className="min-w-0 w-full">
              <ColorPanel
                type={panelType}
                className={classNames(
                  "relative flex w-full flex-col gap-2 p-2 text-left",
                  producing &&
                    !ready &&
                    "cursor-pointer hover:brightness-[1.02]",
                )}
                onClick={
                  producing && !ready
                    ? () => openProducingModal(slot)
                    : undefined
                }
              >
                <div className="flex min-h-0 w-full flex-row gap-2">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center">
                    <img
                      src={getMinigameTokenImage(slot.capToken, tokenImages)}
                      alt=""
                      className="h-full max-w-full object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                    {/* <span
                      className="w-full truncate text-left text-xs leading-tight whitespace-nowrap"
                      style={{ color: labelMuted }}
                    >
                      {t("start")}
                    </span> */}
                    <span
                      className="w-full truncate text-left text-sm font-medium leading-tight whitespace-nowrap"
                      style={{ color: labelStrong }}
                    >
                      {capTokenDisplayName(slot.capToken, config)}
                    </span>
                    <div
                      className="flex min-w-0 w-full flex-row flex-nowrap items-center gap-1.5 text-xs leading-tight"
                      style={{ color: labelStrong }}
                    >
                      <img
                        src={getMinigameTokenImage(
                          outputPreview.token,
                          tokenImages,
                        )}
                        alt=""
                        className="h-4 w-4 shrink-0 object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
                      <span className="min-w-0 text-left leading-snug">
                        {outputPreview.amount}{" "}
                        {capTokenDisplayName(outputPreview.token, config)} /{" "}
                        {produceDurationLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex h-11 w-full shrink-0 flex-col justify-center">
                  {!producing && (
                    <Button
                      className="!min-h-9 !w-full !flex-1 !p-1 !text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        openStartModal(slot);
                      }}
                    >
                      {t("start")}
                    </Button>
                  )}

                  {producing && !ready && (
                    <div className="flex min-h-9 w-full flex-1 flex-row items-center justify-start gap-2">
                      <ResizableBar
                        type="progress"
                        percentage={progress}
                        outerDimensions={{ width: 14, height: 7 }}
                      />
                      <span
                        className="shrink-0 whitespace-nowrap text-xs tabular-nums leading-none"
                        style={{ color: labelStrong }}
                      >
                        {remainingLabel}
                      </span>
                    </div>
                  )}

                  {ready && (
                    <Button
                      className="!min-h-9 !w-full !flex-1 !p-1 !text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCollectModal(slot);
                      }}
                    >
                      {t("collect")}
                    </Button>
                  )}
                </div>
              </ColorPanel>
            </div>
          );
        })}
      </div>

      <MinigameProductionModal
        show={modalVariant !== null}
        variant={modalVariant ?? "start"}
        slot={activeSlot}
        config={config}
        job={activeJob}
        now={now}
        startError={startError}
        tokenImages={tokenImages}
        onClose={closeModal}
        onStart={handleStart}
        onCollect={handleCollect}
      />
    </>
  );
};
