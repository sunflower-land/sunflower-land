import React, { useEffect, useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { GameBridge, WorkerState } from "../bridge/GameBridge";
import { WORKER_ANCHOR } from "../worker/BumpkinWorker";
import { useWorldAnchor } from "../bridge/useWorldAnchor";

/**
 * EXPERIMENT [worker/BumpkinWorker.ts] — while a bumpkin is selected, a
 * small X floats above their head to deselect. That's the whole UI: queued
 * targets already show their blue dots, so no panel.
 *
 * Deselect fires on POINTER DOWN, not click: the anchor tracks a walking
 * bumpkin, so the element can move between mousedown and mouseup and a
 * click pair would never complete — that was the "can't always click it"
 * bug with the old Done button.
 */
export const WorkerUI: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const [state, setState] = useState<WorkerState | null>(bridge.worker.get());
  useEffect(() => bridge.worker.subscribe(setState), [bridge]);
  const rect = useWorldAnchor(WORKER_ANCHOR);

  if (!state?.active || !rect?.visible) return null;

  // rect is the 16px NPC box; the sprite's head reaches roughly one box
  // above it, so the X sits half a box higher again.
  const size = PIXEL_SCALE * 8;

  return (
    <img
      src={SUNNYSIDE.icons.cancel}
      alt="Deselect"
      className="absolute pointer-events-auto cursor-pointer hover:img-highlight z-40"
      style={{
        width: `${size}px`,
        left: `${rect.left + rect.width / 2}px`,
        top: `${rect.top - rect.height * 1.5}px`,
        transform: "translate(-50%, -100%)",
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        event.preventDefault();
        bridge.workerStop();
      }}
    />
  );
};
