import React, { useContext, useEffect, useRef, useState } from "react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { getObjectEntries } from "lib/object";
import type { GameState } from "features/game/types/game";
import type { CollectibleName } from "features/game/types/craftables";
import { getHomeImportPlan } from "features/game/events/landExpansion/importHomeItems";

/** How many items are dug-up-and-placed per narrated batch. */
const BATCH_SIZE = 50;

/** Minimum time each batch is shown for, so the player can read the message
 *  ("Importing 50 items") and watch the room fill in before the next batch. */
const BATCH_DISPLAY_MS = 3000;

/** Per-item pause while placing within a batch, so items trickle in rather
 *  than all popping at once. Clamped so a small batch still finishes promptly. */
const MIN_ITEM_DELAY_MS = 25;
const MAX_ITEM_DELAY_MS = 120;

type Phase = "idle" | "running" | "done";

type Leftover = { name: CollectibleName; count: number };

const chunk = <T,>(items: T[], size: number): T[][] => {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/** Placed collectibles still sitting in the old home, aggregated by name —
 *  i.e. everything the import couldn't move (didn't fit or couldn't be dug up). */
const getHomeLeftover = (state: GameState): Leftover[] =>
  getObjectEntries(state.home.collectibles)
    .map(([name, items]) => ({
      name,
      count: (items ?? []).filter((i) => i.coordinates).length,
    }))
    .filter((l) => l.count > 0);

export type HomeImport = {
  phase: Phase;
  /** Begin the batched migration. No-op if already running. */
  start: () => void;
  /** Return to the idle phase (call when the modal closes). */
  reset: () => void;
  progress: {
    message: string;
    percentage: number;
    completed: number;
    total: number;
    batchCount: number;
    batchesDone: number;
    activeBatch: number;
  };
  /** Items left behind once the migration finishes. */
  leftover: Leftover[];
};

/**
 * Owns the batched home → interior migration: each item is "dug up" from the old
 * home and "placed" on the new floor by dispatching the existing
 * `collectible.removed` + `collectible.placed` events. Items run in batches of
 * {@link BATCH_SIZE}, each batch held for ~{@link BATCH_DISPLAY_MS} with items
 * trickling in, so the room visibly populates behind the modal.
 *
 * Shared by the top-right import button and the on-entry welcome panel.
 */
export function useHomeImport(): HomeImport {
  const { gameService } = useContext(Context);

  const [phase, setPhase] = useState<Phase>("idle");
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [batchCount, setBatchCount] = useState(0);
  const [batchesDone, setBatchesDone] = useState(0);
  const [activeBatch, setActiveBatch] = useState(-1);
  const [leftover, setLeftover] = useState<Leftover[]>([]);

  const aborted = useRef(false);
  const running = useRef(false);

  useEffect(
    () => () => {
      aborted.current = true;
    },
    [],
  );

  const start = async () => {
    if (running.current) return;

    const state = gameService.getSnapshot().context.state;
    const plan = getHomeImportPlan(state);
    const batches = chunk(plan.placements, BATCH_SIZE);

    running.current = true;
    aborted.current = false;
    setTotal(plan.placements.length);
    setCompleted(0);
    setBatchCount(batches.length);
    setBatchesDone(0);
    setActiveBatch(-1);
    setPhase("running");

    let placed = 0;

    for (let i = 0; i < batches.length; i++) {
      if (aborted.current) return;

      const batch = batches[i];
      setActiveBatch(i);

      const itemDelay = clamp(
        Math.floor(BATCH_DISPLAY_MS / batch.length),
        MIN_ITEM_DELAY_MS,
        MAX_ITEM_DELAY_MS,
      );
      const startedAt = Date.now();

      for (const { name, id, location, coordinates } of batch) {
        if (aborted.current) return;
        try {
          // Dig up from the old home (strips coordinates → back in the pool)...
          gameService.send({
            type: "collectible.removed",
            name,
            id,
            location: "home",
          });
          // ...then place on the new floor (moves the now-loose home item).
          gameService.send({
            type: "collectible.placed",
            name,
            id,
            coordinates,
            location,
          });
        } catch {
          // Skip an item that can't be dug up/placed (e.g. an in-use item).
        }
        placed += 1;
        setCompleted(placed);
        await wait(itemDelay);
      }

      // Keep the batch's message up for the full window even if it placed fast.
      const elapsed = Date.now() - startedAt;
      if (elapsed < BATCH_DISPLAY_MS) await wait(BATCH_DISPLAY_MS - elapsed);

      if (aborted.current) return;
      setBatchesDone(i + 1);
    }

    running.current = false;
    if (aborted.current) return;
    setActiveBatch(-1);
    setLeftover(getHomeLeftover(gameService.getSnapshot().context.state));
    setPhase("done");
  };

  const reset = () => {
    if (running.current) return;
    setPhase("idle");
    setTotal(0);
    setCompleted(0);
    setBatchCount(0);
    setBatchesDone(0);
    setActiveBatch(-1);
    setLeftover([]);
  };

  // "Importing 50 items" for the first batch, "...another 50 items" after.
  const activeBatchSize =
    activeBatch >= 0
      ? Math.min(BATCH_SIZE, total - activeBatch * BATCH_SIZE)
      : 0;
  const message =
    activeBatch <= 0
      ? `Importing ${activeBatchSize} items`
      : `Importing another ${activeBatchSize} items`;
  const percentage = total > 0 ? (completed / total) * 100 : 100;

  return {
    phase,
    start: () => void start(),
    reset,
    progress: {
      message,
      percentage,
      completed,
      total,
      batchCount,
      batchesDone,
      activeBatch,
    },
    leftover,
  };
}

export const MigrationRunningPanel: React.FC<{
  progress: HomeImport["progress"];
}> = ({ progress }) => {
  const {
    message,
    percentage,
    completed,
    total,
    batchCount,
    batchesDone,
    activeBatch,
  } = progress;

  return (
    <div className="p-1 flex flex-col gap-2">
      {/* Narrated status — changes with each batch. */}
      <div className="flex items-center gap-2">
        <img
          src={SUNNYSIDE.icons.timer}
          className="w-4 h-4 animate-pulsate"
          alt=""
        />
        <span className="text-sm">{`${message}...`}</span>
      </div>

      <div className="flex items-center gap-2">
        <ResizableBar
          percentage={percentage}
          type="progress"
          outerDimensions={{ width: 40, height: 8 }}
        />
        <span className="text-xs whitespace-nowrap">{`${completed}/${total}`}</span>
      </div>

      <div className="flex flex-col gap-1 max-h-32 overflow-y-auto scrollable pr-1">
        {Array.from({ length: batchCount }).map((_, i) => {
          const done = i < batchesDone;
          const active = i === activeBatch && !done;
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              {done ? (
                <img
                  src={SUNNYSIDE.icons.confirm}
                  className="w-4 h-4"
                  alt="Done"
                />
              ) : (
                <img
                  src={SUNNYSIDE.icons.timer}
                  className={`w-4 h-4 ${active ? "animate-pulsate" : "opacity-40"}`}
                  alt={active ? "Importing" : "Pending"}
                />
              )}
              <span className={done || active ? "" : "opacity-60"}>
                {`Batch ${i + 1} of ${batchCount}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const MigrationDonePanel: React.FC<{
  imported: number;
  leftover: Leftover[];
  onClose: () => void;
}> = ({ imported, leftover, onClose }) => (
  <CloseButtonPanel onClose={onClose} title="Import complete">
    <div className="p-2 flex flex-col gap-2 items-center mb-1">
      <img src={SUNNYSIDE.icons.confirm} className="w-8" alt="Complete" />
      <p className="text-sm text-center">
        {imported > 0
          ? `Imported ${imported} item${imported === 1 ? "" : "s"} into your new home.`
          : "Nothing could be imported."}
      </p>

      {leftover.length > 0 && (
        <div className="flex flex-col gap-1 items-center w-full">
          <Label type="warning">{"These items could not be moved"}</Label>
          <div className="flex flex-wrap justify-center">
            {leftover.map(({ name, count }) => (
              <Box
                key={name}
                image={ITEM_DETAILS[name].image}
                count={new Decimal(count)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
    <Button onClick={onClose}>{"Close"}</Button>
  </CloseButtonPanel>
);
