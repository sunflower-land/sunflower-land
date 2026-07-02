import React, { useContext, useMemo } from "react";

import type { FruitFertiliser, PlantedFruit } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";
import { PATCH_FRUIT_SEEDS, PATCH_FRUIT } from "features/game/types/fruits";
import { FruitSoil } from "./FruitSoil";

import { FruitSeedling } from "./FruitSeedling";

import { DeadTree } from "./DeadTree";
import { ReplenishingTree } from "./ReplenishingTree";
import { ReplenishedTree } from "./ReplenishedTree";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  computeReadyAt,
  getEffectiveSpeedAt,
  getFruitBoostWindows,
  getTurbofruitMixWindows,
  workAccruedAt,
  type BoostWindow,
} from "features/game/lib/boostWindows";

type Stage = "Empty" | "Seedling" | "Replenishing" | "Replenished" | "Dead";

type FruitTreeStatus = {
  stage: Stage;
  timeLeft?: number;
  /**
   * Cycle length (s) for the active phase — the progress-bar denominator. Base
   * grow time legacy; the permanent-boost-only `baseDurationMs` when windowed.
   */
  totalSeconds?: number;
};

const getFruitTreeStatus = (
  plantedFruit: PlantedFruit | undefined,
  now: number,
  windows: BoostWindow[],
): FruitTreeStatus => {
  // No fruits planted
  if (!plantedFruit) return { stage: "Empty" };

  const {
    name,
    harvestsLeft,
    harvestedAt,
    plantedAt,
    baseDurationMs,
    boostedTime,
  } = plantedFruit;

  // Dead tree/bush
  if (!harvestsLeft) return { stage: "Dead" };

  const { seed } = PATCH_FRUIT[name];
  const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];

  // Whichever phase is active governs: a harvested tree is replenishing, an
  // un-harvested one is still growing from the original planting time.
  const isReplenishing = !!harvestedAt;
  const startedAt = harvestedAt || plantedAt;

  let timeLeft: number;
  let totalSeconds: number;

  if (baseDurationMs !== undefined) {
    // Speed-rate model: remaining time is remaining *work* (in base duration),
    // so it ticks down faster while a boost window is active.
    const workDoneMs = workAccruedAt({ startedAt, at: now, windows });
    timeLeft = Math.max((baseDurationMs - workDoneMs) / 1000, 0);
    // Fold pre-lift banked work into the denominator so the progress bar retains
    // its fill across a landscaping lift instead of snapping backward.
    totalSeconds = (baseDurationMs + (boostedTime ?? 0)) / 1000;
  } else {
    timeLeft = Math.max((startedAt + plantSeconds * 1000 - now) / 1000, 0);
    totalSeconds = plantSeconds;
  }

  if (timeLeft > 0) {
    return {
      stage: isReplenishing ? "Replenishing" : "Seedling",
      timeLeft,
      totalSeconds,
    };
  }

  // Fully grown and ready to harvest.
  return { stage: "Replenished" };
};

interface Props {
  plantedFruit?: PlantedFruit;
  fertiliser?: FruitFertiliser;
  plantTree: () => void;
  harvestFruit: () => void;
  removeTree: () => void;
  fertilise: () => void;
  playShakingAnimation: boolean;
  hasAxes: boolean;
}

const _island = (state: MachineState) => state.context.state.island;

// Field comparator for the fruit boost windows so the selector skips re-renders
// without allocating JSON strings per patch on every service update.
const areBoostWindowsEqual = (a: BoostWindow[], b: BoostWindow[]) =>
  a.length === b.length &&
  a.every((window, index) => {
    const other = b[index];
    return (
      other !== undefined &&
      window.from === other.from &&
      window.to === other.to &&
      window.speed === other.speed
    );
  });

export const FruitTree: React.FC<Props> = ({
  plantedFruit,
  fertiliser,
  plantTree,
  harvestFruit,
  removeTree,
  fertilise,
  playShakingAnimation,
  hasAxes,
}) => {
  const { gameService } = useContext(Context);
  const island = useSelector(gameService, _island);
  // Live windowed fruit-growth speed boosts (Orchard Hourglass, Toucan Shrine,
  // totems). Only re-renders when the windows actually change, so the countdown
  // reacts to boosters placed/expired mid-grow.
  const globalBoostWindows = useSelector(
    gameService,
    (state) => getFruitBoostWindows(state.context.state),
    areBoostWindowsEqual,
  );
  // Union the patch's own Turbofruit Mix fertiliser window (per-patch, keyed off
  // fertilisedAt) with the game-global boost windows.
  const fruitBoostWindows = useMemo(
    () => [...globalBoostWindows, ...getTurbofruitMixWindows(fertiliser)],
    [globalBoostWindows, fertiliser],
  );

  const baseDurationMs = plantedFruit?.baseDurationMs;
  const isGrowing = !!plantedFruit && !!plantedFruit.harvestsLeft;
  const startedAt =
    plantedFruit && isGrowing
      ? plantedFruit.harvestedAt || plantedFruit.plantedAt
      : 0;
  const plantSeconds =
    plantedFruit && isGrowing
      ? PATCH_FRUIT_SEEDS[PATCH_FRUIT[plantedFruit.name].seed].plantSeconds
      : 0;
  // Speed-rate model derives the ready time live from the windows; legacy fruit
  // use their (back-dated) start + base grow time.
  const readyAt = !isGrowing
    ? undefined
    : baseDurationMs !== undefined
      ? computeReadyAt({
          startedAt,
          baseDurationMs,
          windows: fruitBoostWindows,
        })
      : startedAt + plantSeconds * 1000;

  // Coarse 1s clock to pick the current boost speed; only windowed fruit are
  // boosted. Tick the countdown faster (1000/speed) so it drops ~1s per visual
  // tick rather than jumping by `speed` each real second.
  const tickNow = useNow({
    live: isGrowing && baseDurationMs !== undefined,
    autoEndAt: readyAt,
  });
  const speed =
    baseDurationMs !== undefined
      ? getEffectiveSpeedAt({ at: tickNow, windows: fruitBoostWindows })
      : 1;
  const intervalMs = Math.max(Math.round(1000 / Math.max(speed, 1)), 250);
  const now = useNow({ live: isGrowing, autoEndAt: readyAt, intervalMs });
  const treeStatus = getFruitTreeStatus(plantedFruit, now, fruitBoostWindows);

  // Empty plot
  if (!plantedFruit) {
    return (
      <div className="absolute w-full h-full" onClick={plantTree}>
        <FruitSoil />
      </div>
    );
  }

  const { name } = plantedFruit;

  // Dead tree
  if (treeStatus.stage === "Dead") {
    return (
      <div className="absolute w-full h-full" onClick={removeTree}>
        <DeadTree patchFruitName={name} hasAxes={hasAxes} />
      </div>
    );
  }

  // Seedling tree
  if (treeStatus.stage === "Seedling" && !!treeStatus.timeLeft) {
    return (
      <div className="absolute w-full h-full" onClick={fertilise}>
        <FruitSeedling
          island={island}
          patchFruitName={name}
          timeLeft={treeStatus.timeLeft}
          totalSeconds={treeStatus.totalSeconds}
          speed={speed}
        />
      </div>
    );
  }

  // Replenishing tree
  if (treeStatus.stage === "Replenishing" && !!treeStatus.timeLeft) {
    return (
      <div className="absolute w-full h-full" onClick={fertilise}>
        <ReplenishingTree
          island={island}
          patchFruitName={name}
          timeLeft={treeStatus.timeLeft}
          totalSeconds={treeStatus.totalSeconds}
          speed={speed}
          playShakeAnimation={playShakingAnimation}
        />
      </div>
    );
  }

  // Ready tree
  return (
    <div className="absolute w-full h-full" onClick={harvestFruit}>
      <ReplenishedTree island={island} patchFruitName={name} />
    </div>
  );
};
