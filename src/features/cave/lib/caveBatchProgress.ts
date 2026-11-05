import type { CaveBatch } from "features/game/types/game";

/** How far a batch has grown, 0 to 100 (100 once ready). */
export const getCaveBatchPercentage = (batch: CaveBatch, now: number) =>
  batch.readyAt <= batch.startedAt
    ? 100
    : Math.min(
        100,
        Math.max(
          0,
          ((now - batch.startedAt) / (batch.readyAt - batch.startedAt)) * 100,
        ),
      );
