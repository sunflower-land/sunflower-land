import React from "react";
import { createPortal } from "react-dom";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { MinigameConfig } from "../lib/types";
import {
  capTokenDisplayName,
  formatMinigameDuration,
  getCollectOutputForSlot,
  type CapBalanceProductionSlot,
} from "../lib/extractProductionSlots";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import type { ProducingEntry } from "../lib/types";

type Variant = "start" | "producing" | "collect";

type Props = {
  show: boolean;
  variant: Variant;
  slot: CapBalanceProductionSlot | null;
  config: MinigameConfig;
  job: ProducingEntry | null;
  now: number;
  startError: string | null;
  tokenImages: Record<string, string>;
  onClose: () => void;
  onStart: () => void;
  onCollect: () => void;
};

export const MinigameProductionModal: React.FC<Props> = ({
  show,
  variant,
  slot,
  config,
  job,
  now,
  startError,
  tokenImages,
  onClose,
  onStart,
  onCollect,
}) => {
  if (!show || !slot) return null;

  const startDef = config.actions[slot.startActionId];
  const collectDef = config.actions[slot.collectActionId];
  const title = capTokenDisplayName(slot.capToken, config);
  const slotLabel = capTokenDisplayName(slot.capToken, config);

  const burnEntries = startDef?.burn
    ? Object.entries(startDef.burn)
    : [];
  const requireEntries = startDef?.require
    ? Object.entries(startDef.require)
    : [];

  const collectLines =
    collectDef?.collect && variant === "collect"
      ? Object.entries(collectDef.collect)
      : [];

  const startOutputPreview = getCollectOutputForSlot(config, slot);

  const remainingMs =
    job && now < job.completesAt ? job.completesAt - now : 0;

  return createPortal(
    <div
      data-html2canvas-ignore="true"
      className="fixed inset-safe-area z-[70] flex items-center justify-center"
      style={{ background: "rgb(0 0 0 / 56%)" }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-full max-w-full"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
      <CloseButtonPanel className="w-[min(92vw,420px)]" onClose={onClose}>
        <div className="p-1 space-y-2">
          <Label type="default">{title}</Label>

          {variant === "start" && (
            <>
              <p className="text-xs">
                Start a production run for this {slotLabel}.
              </p>
              <p className="text-xs">
                Duration:{" "}
                <span className="font-medium">
                  {formatMinigameDuration(slot.msToComplete)}
                </span>
              </p>
              {startOutputPreview && (
                <div className="mt-2 rounded-sm bg-black/5 p-2">
                  <p className="mb-1.5 text-[11px] font-medium text-[#3e2731]">
                    Produces when complete
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <img
                      src={getMinigameTokenImage(
                        startOutputPreview.token,
                        tokenImages,
                      )}
                      alt=""
                      className="h-5 w-5 shrink-0 object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <span className="text-xs font-medium text-[#181425]">
                      {startOutputPreview.amount}{" "}
                      {capTokenDisplayName(startOutputPreview.token, config)}
                    </span>
                  </div>
                </div>
              )}
              {requireEntries.length > 0 && (
                <div className="text-xs">
                  <span className="font-medium">Requires:</span>
                  <ul className="mt-1 space-y-1">
                    {requireEntries.map(([token, rule]) => (
                      <li key={token} className="flex items-center gap-1">
                        <span>
                          {rule.amount}× {capTokenDisplayName(token, config)}
                        </span>
                        <img
                          src={getMinigameTokenImage(token, tokenImages)}
                          alt=""
                          style={{
                            width: `${PIXEL_SCALE * 4}px`,
                            height: `${PIXEL_SCALE * 4}px`,
                            imageRendering: "pixelated",
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {burnEntries.length > 0 && (
                <div className="text-xs">
                  <span className="font-medium">Uses:</span>
                  <ul className="mt-1 space-y-1">
                    {burnEntries.map(([token, rule]) => (
                      <li key={token} className="flex items-center gap-1">
                        <span>
                          {rule.amount}× {capTokenDisplayName(token, config)}
                        </span>
                        <img
                          src={getMinigameTokenImage(token, tokenImages)}
                          alt=""
                          style={{
                            width: `${PIXEL_SCALE * 4}px`,
                            height: `${PIXEL_SCALE * 4}px`,
                            imageRendering: "pixelated",
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {burnEntries.length === 0 && requireEntries.length === 0 && (
                <p className="text-xs text-[#555]">No extra resources required.</p>
              )}
              {startError && (
                <p className="text-xs text-red-700">{startError}</p>
              )}
            </>
          )}

          {variant === "producing" && (
            <>
              {job ? (
                <>
                  <p className="text-xs">
                    This {slotLabel} is producing{" "}
                    <span className="font-medium">
                      {capTokenDisplayName(slot.outputToken, config)}
                    </span>
                    .
                  </p>
                  {now >= job.completesAt ? (
                    <p className="text-xs text-green-800 font-medium">
                      Ready to collect — tap the icon above this {slotLabel}.
                    </p>
                  ) : (
                    <p className="text-xs">
                      Ready in{" "}
                      <span className="font-medium">
                        {formatMinigameDuration(remainingMs)}
                      </span>
                      .
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs">
                  No active production for this {slotLabel}.
                </p>
              )}
            </>
          )}

          {variant === "collect" && (
            <>
              {collectLines.length > 0 ? (
                <>
                  <p className="text-xs">Collect your production:</p>
                  <ul className="text-xs space-y-1">
                    {collectLines.map(([token, rule]) => (
                      <li key={token} className="flex items-center gap-1">
                        <span className="font-medium text-green-800">
                          +{rule.amount} {capTokenDisplayName(token, config)}
                        </span>
                        <img
                          src={getMinigameTokenImage(token, tokenImages)}
                          alt=""
                          style={{
                            width: `${PIXEL_SCALE * 5}px`,
                            height: `${PIXEL_SCALE * 5}px`,
                            imageRendering: "pixelated",
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-xs">Nothing to collect.</p>
              )}
              {startError && (
                <p className="text-xs text-red-700">{startError}</p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {variant === "start" && (
            <Button onClick={onStart}>Start</Button>
          )}
          {variant === "collect" && (
            <Button onClick={onCollect}>Collect</Button>
          )}
        </div>
      </CloseButtonPanel>
      </div>
    </div>,
    document.body,
  );
};
