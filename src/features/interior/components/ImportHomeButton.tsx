import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getObjectEntries } from "lib/object";
import {
  getHomeImportPlan,
  type HomeImportPlan,
} from "features/game/events/landExpansion/importHomeItems";

/** How many items are dug-up-and-placed per narrated batch. */
const BATCH_SIZE = 50;

/** Minimum time each batch is shown for, so the player can read the message
 *  ("Importing 50 items") and watch the room fill in before the next batch. */
const BATCH_DISPLAY_MS = 3000;

/** Per-item pause while placing within a batch, so items trickle in rather
 *  than all popping at once. Clamped so a small batch still finishes promptly. */
const MIN_ITEM_DELAY_MS = 25;
const MAX_ITEM_DELAY_MS = 120;

type Phase = "confirm" | "running" | "done";

const _hasHomeItems = (state: MachineState) =>
  getObjectEntries(state.context.state.home.collectibles).some(([, items]) =>
    (items ?? []).some((item) => !!item.coordinates),
  );

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

/**
 * "Import items" button + migration panel, pinned to the top-right of the house
 * layout by the caller (Interior / LevelOne). The button always shows while the
 * old `home` still has any placed items.
 *
 * Confirming runs the import as a batched migration: each item is "dug up" from
 * the old home and "placed" on the new floor by dispatching the existing
 * `collectible.removed` + `collectible.placed` events — no bespoke import event.
 * Items are processed in batches of {@link BATCH_SIZE}, pausing between batches
 * so the room visibly populates behind the (backdrop-less) modal while a
 * progress bar and per-batch checklist track how it's going.
 */
export const ImportHomeButton: React.FC = () => {
  const { gameService } = useContext(Context);

  const hasHomeItems = useSelector(gameService, _hasHomeItems);
  const [open, setOpen] = useState(false);

  if (!hasHomeItems) return null;

  return (
    <>
      <div style={{ width: `${PIXEL_SCALE * 64}px` }}>
        <Button onClick={() => setOpen(true)}>{"Import items"}</Button>
      </div>
      <ImportHomeFlow open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const ImportHomeFlow: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { gameService } = useContext(Context);

  const [phase, setPhase] = useState<Phase>("confirm");
  const [plan, setPlan] = useState<HomeImportPlan | null>(null);
  const [batchCount, setBatchCount] = useState(0);
  const [batchesDone, setBatchesDone] = useState(0);
  const [activeBatch, setActiveBatch] = useState(-1);
  const [completed, setCompleted] = useState(0);

  // Set while the component is unmounted / closed so an in-flight migration
  // stops touching React state.
  const aborted = useRef(false);

  // (Re)initialise the flow each time it opens — compute the plan up front from
  // a live snapshot so the confirm screen and the batching agree.
  useEffect(() => {
    if (!open) return;
    aborted.current = false;
    setPhase("confirm");
    setBatchesDone(0);
    setActiveBatch(-1);
    setCompleted(0);
    setPlan(getHomeImportPlan(gameService.getSnapshot().context.state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      aborted.current = true;
    };
  }, []);

  const total = plan?.placements.length ?? 0;
  const wontFit = plan?.unplaced.length ?? 0;

  const runImport = async () => {
    if (!plan || plan.placements.length === 0) return;

    const batches = chunk(plan.placements, BATCH_SIZE);
    setBatchCount(batches.length);
    setBatchesDone(0);
    setCompleted(0);
    setPhase("running");

    let placed = 0;

    for (let i = 0; i < batches.length; i++) {
      if (aborted.current) return;

      const batch = batches[i];
      setActiveBatch(i);

      // Spread this batch's placements across the display window so items
      // trickle into the room behind the modal instead of all at once.
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

    if (!aborted.current) {
      setActiveBatch(-1);
      setPhase("done");
    }
  };

  const percentage = total > 0 ? (completed / total) * 100 : 0;

  // "Importing 50 items" for the first batch, "...another 50 items" after.
  const activeBatchSize =
    activeBatch >= 0
      ? Math.min(BATCH_SIZE, total - activeBatch * BATCH_SIZE)
      : 0;
  const runningMessage =
    activeBatch <= 0
      ? `Importing ${activeBatchSize} items`
      : `Importing another ${activeBatchSize} items`;

  return (
    <Modal
      show={open}
      // No backdrop once we start so the player can watch the room fill in.
      backdrop={phase === "confirm"}
      onHide={phase === "running" ? undefined : onClose}
    >
      {phase === "confirm" && (
        <CloseButtonPanel onClose={onClose} title="Import items">
          <div className="p-2 flex flex-col gap-3 mb-1">
            <p className="text-sm">
              {
                "You still have items in your old home. Would you like to instantly import them into your new land? The layout will not be preserved."
              }
            </p>
            <div className="flex flex-col gap-1">
              <Label type="default">
                {`${total} item${total === 1 ? "" : "s"} will be imported`}
              </Label>
              {wontFit > 0 && (
                <Label type="warning">
                  {`${wontFit} item${
                    wontFit === 1 ? " won't" : "s won't"
                  } fit and will stay in your old home`}
                </Label>
              )}
            </div>
          </div>
          <Button disabled={total === 0} onClick={runImport}>
            {total === 0 ? "Nothing to import" : "Import"}
          </Button>
        </CloseButtonPanel>
      )}

      {phase === "running" && (
        <Panel>
          <MigrationProgress
            message={runningMessage}
            percentage={percentage}
            completed={completed}
            total={total}
            batchCount={batchCount}
            batchesDone={batchesDone}
            activeBatch={activeBatch}
          />
        </Panel>
      )}

      {phase === "done" && (
        <CloseButtonPanel onClose={onClose} title="Import complete">
          <div className="p-2 flex flex-col gap-2 items-center mb-1">
            <img src={SUNNYSIDE.icons.confirm} className="w-8" alt="Complete" />
            <p className="text-sm text-center">
              {`Imported ${total} item${total === 1 ? "" : "s"} into your new home.`}
            </p>
            {wontFit > 0 && (
              <Label type="warning">
                {`${wontFit} item${
                  wontFit === 1 ? "" : "s"
                } didn't fit and stayed in your old home`}
              </Label>
            )}
          </div>
          <Button onClick={onClose}>{"Close"}</Button>
        </CloseButtonPanel>
      )}
    </Modal>
  );
};

const MigrationProgress: React.FC<{
  message: string;
  percentage: number;
  completed: number;
  total: number;
  batchCount: number;
  batchesDone: number;
  activeBatch: number;
}> = ({
  message,
  percentage,
  completed,
  total,
  batchCount,
  batchesDone,
  activeBatch,
}) => (
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
