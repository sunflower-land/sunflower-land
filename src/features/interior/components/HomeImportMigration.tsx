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
import {
  getHomeImportPlan,
  getHomeRemovalEvents,
  tryApplyImportStep,
  type ImportPlacement,
} from "features/game/events/landExpansion/importHomeItems";

/** How many items are moved per narrated batch. */
const BATCH_SIZE = 50;

/** Minimum time each batch is shown for, so the player can read the message
 *  ("Importing 50 items") and watch the room fill in before the next batch. */
const BATCH_DISPLAY_MS = 3000;

/** Per-item pause while placing within a batch, so items trickle in rather
 *  than all popping at once. Clamped so a small batch still finishes promptly. */
const MIN_ITEM_DELAY_MS = 25;
const MAX_ITEM_DELAY_MS = 120;

type Phase = "idle" | "running" | "done";

/** A stack of same-named collectibles, used for both the "imported" summary and
 *  the "couldn't be moved" list. */
type ItemStack = { name: CollectibleName; count: number };

/** Aggregates successfully-moved placements into displayable stacks. Only
 *  collectibles are listed — bumpkins, farm hands, buds and pets have no
 *  ITEM_DETAILS entry to draw a box from, though they still count towards the
 *  imported total. */
const summarise = (placements: ImportPlacement[]): ItemStack[] => {
  const counts = placements.reduce<Partial<Record<CollectibleName, number>>>(
    (acc, { item }) => {
      if (item.kind !== "collectible") return acc;
      const name = item.name as CollectibleName;
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return getObjectEntries(counts).map(([name, count]) => ({
    name,
    count: count as number,
  }));
};

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
 *  i.e. everything the import couldn't move (didn't fit or couldn't be moved). */
const getHomeLeftover = (state: GameState): ItemStack[] =>
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
  /** Dig up everything the import left behind, returning it to the inventory. */
  digUp: () => void;
  progress: {
    message: string;
    percentage: number;
    completed: number;
    total: number;
    batchCount: number;
    batchesDone: number;
    activeBatch: number;
  };
  /** What actually made it across, aggregated by item. */
  imported: ItemStack[];
  /** How many items made it across, including farm hands / buds / pets. */
  importedCount: number;
  /** Items left behind once the migration finishes. */
  leftover: ItemStack[];
};

/**
 * Owns the batched home → interior migration: each item is dug up from the old
 * home and placed on the new floor by dispatching the existing
 * `*.removed` + `*.placed` events. The dig-up + place-down pair is dry-run via
 * {@link tryApplyImportStep} first, so an item that can't be placed is left
 * untouched in the old home rather than dug up and stranded in the inventory.
 * Items run in batches of {@link BATCH_SIZE}, each batch held for
 * ~{@link BATCH_DISPLAY_MS} with items trickling in, so the room visibly
 * populates behind the modal.
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
  const [imported, setImported] = useState<ItemStack[]>([]);
  const [importedCount, setImportedCount] = useState(0);
  const [leftover, setLeftover] = useState<ItemStack[]>([]);

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
    setImported([]);
    setImportedCount(0);
    setPhase("running");

    // `attempted` drives the progress bar; `succeeded` records what actually
    // landed, which is what the summary reports. They diverge when an item's
    // spot is taken between planning and applying.
    let attempted = 0;
    const succeeded: ImportPlacement[] = [];

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

      for (const placement of batch) {
        if (aborted.current) return;

        // Dig up + place down together, but only commit if the place would
        // actually succeed. We dry-run both reducers against the live snapshot
        // first; if the item can't land, we send nothing and it stays exactly
        // where it was in the old home — never dug up and stranded in the
        // inventory.
        const live = gameService.getSnapshot().context.state;
        const result = tryApplyImportStep(live, placement);
        if (result) {
          result.events.forEach((event) => gameService.send(event));
          succeeded.push(placement);
        }

        attempted += 1;
        setCompleted(attempted);
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
    setImported(summarise(succeeded));
    setImportedCount(succeeded.length);
    setLeftover(getHomeLeftover(gameService.getSnapshot().context.state));
    setPhase("done");
  };

  // Everything the import couldn't move goes straight back to the inventory, so
  // the old home is left empty before it's retired.
  const digUp = () => {
    if (running.current) return;
    const state = gameService.getSnapshot().context.state;
    getHomeRemovalEvents(state).forEach((event) => gameService.send(event));
    setLeftover(getHomeLeftover(gameService.getSnapshot().context.state));
  };

  const reset = () => {
    if (running.current) return;
    setPhase("idle");
    setTotal(0);
    setCompleted(0);
    setBatchCount(0);
    setBatchesDone(0);
    setActiveBatch(-1);
    setImported([]);
    setImportedCount(0);
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
    digUp,
    imported,
    importedCount,
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
  imported: ItemStack[];
  importedCount: number;
  leftover: ItemStack[];
  onDigUp: () => void;
  onClose: () => void;
}> = ({ imported, importedCount, leftover, onDigUp, onClose }) => (
  <CloseButtonPanel onClose={onClose} title="Import complete">
    <div className="p-2 flex flex-col gap-2 items-center mb-1">
      <img src={SUNNYSIDE.icons.confirm} className="w-8" alt="Complete" />
      <p className="text-sm text-center">
        {importedCount > 0
          ? `Imported ${importedCount} item${
              importedCount === 1 ? "" : "s"
            } into your new home.`
          : "Nothing could be imported."}
      </p>

      {imported.length > 0 && (
        <div className="flex flex-col gap-1 items-center w-full">
          <Label type="success">{"Moved across"}</Label>
          <div className="flex flex-wrap justify-center max-h-32 overflow-y-auto scrollable">
            {imported.map(({ name, count }) => (
              <Box
                key={name}
                image={ITEM_DETAILS[name].image}
                count={new Decimal(count)}
              />
            ))}
          </div>
        </div>
      )}

      {leftover.length > 0 && (
        <div className="flex flex-col gap-1 items-center w-full">
          <Label type="warning">{"These items could not be moved"}</Label>
          <div className="flex flex-wrap justify-center max-h-32 overflow-y-auto scrollable">
            {leftover.map(({ name, count }) => (
              <Box
                key={name}
                image={ITEM_DETAILS[name].image}
                count={new Decimal(count)}
              />
            ))}
          </div>
          <p className="text-xxs text-center">
            {
              "There was no room for these. You can dig them up to send them back to your inventory."
            }
          </p>
        </div>
      )}
    </div>

    {leftover.length > 0 ? (
      <div className="flex space-x-1">
        <Button onClick={onClose}>{"Close"}</Button>
        <Button onClick={onDigUp}>{"Dig them up"}</Button>
      </div>
    ) : (
      <Button onClick={onClose}>{"Close"}</Button>
    )}
  </CloseButtonPanel>
);
