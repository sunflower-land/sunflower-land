import React, { useContext, useMemo, useState, type JSX } from "react";

import { CROPS, type CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { type GrowthStage, Soil } from "features/island/plots/components/Soil";
import { Bar, ProgressBar } from "components/ui/ProgressBar";

import powerup from "assets/icons/level_up.png";
import locust from "assets/icons/locust.webp";
import sunshower from "assets/icons/sunshower.webp";
import bee from "assets/icons/bee.webp";

import { TimerPopover } from "../../common/TimerPopover";
import classNames from "classnames";
import type { CropFertiliser, CropPlot } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import type { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useNow } from "lib/utils/hooks/useNow";
import { CROP_COMPOST } from "features/game/types/composters";
import {
  computeReadyAt,
  getEffectiveSpeedAt,
  workAccruedAt,
  type BoostWindow,
} from "features/game/lib/boostWindows";

interface Props {
  cropName?: CropName;
  plot: CropPlot;
  plantedAt?: number;
  fertiliser?: CropFertiliser;
  procAnimation?: JSX.Element;
  touchCount: number;
  showTimers: boolean;
  /** Live windowed speed boosts (e.g. Sparrow Shrine) affecting crop growth. */
  boostWindows: BoostWindow[];
  /** Live timestamp from the parent; used to pick the current boost speed. */
  now: number;
}

const _island = (state: MachineState) => state.context.state.island;
const _calendar = (state: MachineState) => state.context.state.calendar;

const clampPercentage = (value: number) => Math.min(Math.max(value, 0), 100);

const getGrowthStage = (
  cropName?: CropName,
  percentage?: number,
): GrowthStage | undefined => {
  if (!cropName || percentage === undefined) return undefined;
  if (percentage >= 100) return "ready";
  if (percentage >= 50) return "almost";
  if (percentage >= 25) return "halfway";
  return "seedling";
};

const getHarvestMetrics = ({
  cropName,
  plot,
  plantedAt,
  boostWindows,
}: {
  cropName?: CropName;
  plot: CropPlot;
  plantedAt?: number;
  boostWindows: BoostWindow[];
}): {
  harvestSeconds: number;
  readyAt: number;
  startAt: number;
  baseDurationMs?: number;
} => {
  const plantedTimestamp = plantedAt ?? plot.crop?.plantedAt ?? 0;

  if (!cropName || !plantedTimestamp) {
    return { harvestSeconds: 0, readyAt: 0, startAt: 0 };
  }

  // Speed-rate model: derive the ready time live from the boost windows so the
  // countdown ticks at the boosted rate and reacts to shrines placed mid-grow.
  const baseDurationMs =
    plot.crop?.name === cropName ? plot.crop?.baseDurationMs : undefined;

  if (baseDurationMs !== undefined) {
    const readyAt = computeReadyAt({
      startedAt: plantedTimestamp,
      baseDurationMs,
      windows: boostWindows,
    });

    return {
      baseDurationMs,
      harvestSeconds: baseDurationMs / 1000,
      readyAt,
      startAt: plantedTimestamp,
    };
  }

  // Legacy model: back-dated plantedAt + base grow time.
  const baseHarvestSeconds = CROPS[cropName].harvestSeconds;
  const boostOffsetMs =
    plot.crop?.name === cropName ? (plot.crop?.boostedTime ?? 0) : 0;
  const harvestSeconds = Math.max(baseHarvestSeconds - boostOffsetMs / 1000, 0);
  const startAt = plantedTimestamp + boostOffsetMs;
  const readyAt = startAt + harvestSeconds * 1000;

  return { harvestSeconds, readyAt, startAt };
};

export const FertilePlot: React.FC<Props> = ({
  cropName,
  plot,
  plantedAt,
  fertiliser,
  procAnimation,
  touchCount,
  showTimers,
  boostWindows,
  now,
}) => {
  const { gameService, selectedItem } = useContext(Context);
  // Only treat the player as "applying fertiliser" when the plot is still
  // empty — applying onto an already-fertilised plot is a no-op, so the
  // tooltip should still show in that case.
  const isApplyingFertiliser =
    !!selectedItem && selectedItem in CROP_COMPOST && !fertiliser;

  const island = useSelector(gameService, _island);
  const calendar = useSelector(gameService, _calendar);

  const [showTimerPopover, setShowTimerPopover] = useState(false);
  const { harvestSeconds, readyAt, startAt, baseDurationMs } = useMemo(
    () => getHarvestMetrics({ cropName, plot, plantedAt, boostWindows }),
    [cropName, plantedAt, plot, boostWindows],
  );
  // Tick faster while a boost window is active so the displayed countdown drops
  // ~1s per visual tick (a faster-running clock) instead of jumping by `speed`
  // each real second. speed === 1 keeps the normal 1s cadence. Only crops on the
  // speed-rate model (baseDurationMs set) are boosted; legacy crops stay at 1×.
  const speed =
    baseDurationMs !== undefined
      ? getEffectiveSpeedAt({ at: now, windows: boostWindows })
      : 1;
  const intervalMs = Math.max(Math.round(1000 / Math.max(speed, 1)), 250);
  const currentTime = useNow({
    live: readyAt > 0,
    autoEndAt: readyAt,
    intervalMs,
  });
  const isGrowing = harvestSeconds > 0 ? readyAt > currentTime : false;
  // A windowed speed boost (e.g. Sparrow Shrine) is actively speeding this crop.
  const isBoosted = isGrowing && speed > 1;

  // For speed-rate crops the remaining time is the remaining *work* (in base
  // duration), so it visibly ticks down faster while a boost window is active.
  let timeLeft = 0;
  let growPercentage = 100;
  if (readyAt > 0 && harvestSeconds > 0) {
    if (baseDurationMs !== undefined) {
      // Work banked before a landscaping lift (see placePlot): already done, so
      // it counts toward the displayed progress but not toward the remaining
      // time. Undefined for crops that were never lifted.
      const bankedMs =
        plot.crop?.name === cropName ? (plot.crop?.boostedTime ?? 0) : 0;
      const workDoneMs = workAccruedAt({
        startedAt: startAt,
        at: currentTime,
        windows: boostWindows,
      });
      timeLeft = Math.max((baseDurationMs - workDoneMs) / 1000, 0);
      growPercentage = clampPercentage(
        ((bankedMs + workDoneMs) / (baseDurationMs + bankedMs)) * 100,
      );
    } else {
      timeLeft = Math.max((readyAt - currentTime) / 1000, 0);
      growPercentage = clampPercentage(100 - (timeLeft / harvestSeconds) * 100);
    }
  }

  const activeInsectPlague =
    getActiveCalendarEvent({ calendar }) === "insectPlague";
  const isProtected = calendar.insectPlague?.protected;
  const stage = getGrowthStage(cropName, growPercentage);

  const isSunshower = getActiveCalendarEvent({ calendar }) === "sunshower";

  // Plot status indicators are packed into the four corners clockwise from the
  // top-left so they never overlap regardless of which are active.
  const cornerStyles: React.CSSProperties[] = [
    { top: `${PIXEL_SCALE * -2}px`, left: `${PIXEL_SCALE * 0}px` }, // top-left
    { top: `${PIXEL_SCALE * -2}px`, right: `${PIXEL_SCALE * -2}px` }, // top-right
    { bottom: `${PIXEL_SCALE * 9}px`, right: `${PIXEL_SCALE * 0}px` }, // bottom-right
    { bottom: `${PIXEL_SCALE * 9}px`, left: `${PIXEL_SCALE * 0}px` }, // bottom-left
  ];

  const SPROUT_MIX_ICON = powerup; // yield boost
  const RAPID_ROOT_ICON = SUNNYSIDE.icons.stopwatch; // speed boost

  // Sproutroot Surprise = Sprout Mix (yield) + Rapid Root (speed).
  const fertiliserIcons: string[] =
    fertiliser?.name === "Sprout Mix"
      ? [SPROUT_MIX_ICON]
      : fertiliser?.name === "Rapid Root"
        ? [RAPID_ROOT_ICON]
        : fertiliser?.name === "Sproutroot Surprise"
          ? [SPROUT_MIX_ICON, RAPID_ROOT_ICON]
          : [];

  const weatherIcon =
    activeInsectPlague && !isProtected
      ? locust
      : isSunshower
        ? sunshower
        : undefined;

  // Each icon is its own entry in priority order and takes the next free
  // corner. Any overflow beyond four shares the last corner.
  const cornerIcons: {
    key: string;
    src: string;
    size: number;
    pulse?: boolean;
  }[] = [
    ...(isBoosted
      ? [{ key: "boost", src: SUNNYSIDE.icons.lightning, size: 7, pulse: true }]
      : []),
    ...(weatherIcon ? [{ key: "weather", src: weatherIcon, size: 10 }] : []),
    ...(plot.beeSwarm ? [{ key: "bee", src: bee, size: 8 }] : []),
    ...fertiliserIcons.map((src, i) => ({
      key: `fertiliser-${i}`,
      src,
      size: 6,
    })),
  ];

  const cornerBuckets: (typeof cornerIcons)[] = [[], [], [], []];
  cornerIcons.forEach((icon, index) =>
    cornerBuckets[Math.min(index, cornerStyles.length - 1)].push(icon),
  );

  const handleMouseEnter = () => {
    // Suppress the boost/timer popover while the player is applying a crop
    // fertiliser — the tooltip would block the click target and isn't useful
    // to that flow.
    if (isApplyingFertiliser) return;
    // show details if field is growing
    if (isGrowing) {
      // set state to show details
      setShowTimerPopover(true);
    }
  };

  const handleMouseLeave = () => {
    // set state to hide details
    setShowTimerPopover(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative"
    >
      <div
        className={classNames("w-full h-full relative", {
          "cursor-pointer hover:img-highlight":
            !stage || stage === "ready" || isApplyingFertiliser,
        })}
      >
        {/* Crop base image */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        >
          <Soil cropName={cropName} stage={stage} island={island} />
        </div>
      </div>
      {/* Status indicators, packed into corners clockwise from the top-left */}
      {cornerBuckets.map((bucket, index) =>
        bucket.length === 0 ? null : (
          <div
            key={index}
            className="absolute z-20 pointer-events-none flex"
            style={cornerStyles[index]}
          >
            {bucket.map((icon) => (
              <img
                key={icon.key}
                src={icon.src}
                alt=""
                aria-hidden
                className={icon.pulse ? "animate-pulse" : undefined}
                style={{ width: `${PIXEL_SCALE * icon.size}px` }}
              />
            ))}
          </div>
        ),
      )}

      {/* Time popover */}
      {!!cropName && isGrowing && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -18}px`,
          }}
        >
          <TimerPopover
            image={ITEM_DETAILS[cropName].image}
            description={cropName}
            showPopover={showTimerPopover && !isApplyingFertiliser}
            timeLeft={timeLeft}
            speed={speed}
          />
        </div>
      )}

      {/* Health bar for collecting rewards */}
      {!!touchCount && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * 9}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <Bar percentage={100 - touchCount * 50} type="health" />
        </div>
      )}

      {/* Progress bar for growing crops */}
      {showTimers && isGrowing && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * 9}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <ProgressBar
            percentage={growPercentage}
            seconds={timeLeft}
            type="progress"
            formatLength="short"
          />
          {/* Lightning next to the timer while a speed boost is active */}
          {isBoosted && (
            <img
              src={SUNNYSIDE.icons.lightning}
              alt=""
              aria-hidden
              className="absolute z-30 pointer-events-none animate-pulse"
              style={{
                width: `${PIXEL_SCALE * 4}px`,
                top: `${PIXEL_SCALE * -5}px`,
                left: `${PIXEL_SCALE * 13}px`,
              }}
            />
          )}
        </div>
      )}

      {/* Firework animation */}
      {procAnimation}
    </div>
  );
};
