import React, { useContext, useState } from "react";
import { RecoveredOilReserve } from "./components/RecoveredOilReserve";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { OilReserve as IOilReserve } from "features/game/types/game";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import {
  OIL_RESERVE_RECOVERY_TIME,
  getOilDropAmount,
  getRequiredOilDrillAmount,
  isNextDrillHasBonus,
} from "features/game/events/landExpansion/drillOilReserve";
import { RecoveringOilReserve } from "./components/RecoveringOilReserve";
import { DepletedOilReserve } from "./components/DepletedOilReserve";
import { getTimeLeft } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
import {
  computeReadyAt,
  getEffectiveSpeedAt,
  getOilBoostWindows,
  workAccruedAt,
  type BoostWindow,
} from "features/game/lib/boostWindows";

interface Props {
  id: string;
}

const _reserve = (id: string) => (state: MachineState) =>
  state.context.state.oilReserves[id];
const _drills = (state: MachineState) =>
  state.context.state.inventory["Oil Drill"] ?? new Decimal(0);

const compareResource = (prev: IOilReserve, next: IOilReserve) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

// Field comparator for the oil boost windows so the selector skips re-renders
// without allocating JSON strings on every service update.
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

export const OilReserve: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const [drilling, setDrilling] = useState(false);
  const [oilHarvested, setOilHarvested] = useState(0);

  const reserve = useSelector(gameService, _reserve(id), compareResource);
  const drills = useSelector(gameService, _drills);
  // Derive just the values this component needs from game state, each with its own
  // comparator, instead of holding a whole-game snapshot (which would either
  // re-render every tick or — if narrowly compared — go stale for the oil-yield
  // animation when e.g. a Stag Shrine is placed).
  const requiredDrillAmount = useSelector(
    gameService,
    (state) => getRequiredOilDrillAmount(state.context.state).amount,
    (a, b) => a.equals(b),
  );
  const oilDropAmount = useSelector(
    gameService,
    (state) => {
      const oilReserve = state.context.state.oilReserves[id];
      return oilReserve
        ? getOilDropAmount(state.context.state, oilReserve).amount
        : 0;
    },
    (a, b) => a === b,
  );
  // Live windowed oil-recovery speed boost (Stag Shrine). Recomputed from full
  // state but only re-renders when the windows actually change, so the countdown
  // reacts to a Stag Shrine placed/expired mid-recovery.
  const oilBoostWindows = useSelector(
    gameService,
    (state) => getOilBoostWindows(state.context.state),
    areBoostWindowsEqual,
  );

  const { drilledAt, baseDurationMs } = reserve.oil;
  // Speed-rate model (baseDurationMs set): derive the ready time live from the
  // boost windows. Legacy reserves use the back-dated drilledAt + base recovery.
  const readyAt =
    baseDurationMs !== undefined
      ? computeReadyAt({
          startedAt: drilledAt,
          baseDurationMs,
          windows: oilBoostWindows,
        })
      : drilledAt + OIL_RESERVE_RECOVERY_TIME * 1000;

  // Coarse 1s clock to pick the current boost speed; only windowed reserves are
  // boosted. Tick the countdown faster (1000/speed) so it drops ~1s per visual
  // tick rather than jumping by `speed` each second.
  const tickNow = useNow({
    live: baseDurationMs !== undefined,
    autoEndAt: readyAt,
  });
  const speed =
    baseDurationMs !== undefined
      ? getEffectiveSpeedAt({ at: tickNow, windows: oilBoostWindows })
      : 1;
  const intervalMs = Math.max(Math.round(1000 / Math.max(speed, 1)), 250);
  const now = useNow({ live: true, autoEndAt: readyAt, intervalMs });

  // For windowed reserves the remaining time is remaining *work* (in base
  // duration), so it visibly ticks down faster while a boost window is active.
  const timeLeft =
    baseDurationMs !== undefined
      ? Math.max(
          (baseDurationMs -
            workAccruedAt({
              startedAt: drilledAt,
              at: now,
              windows: oilBoostWindows,
            })) /
            1000,
          0,
        )
      : getTimeLeft(drilledAt, OIL_RESERVE_RECOVERY_TIME, now);

  const ready = timeLeft <= 0;
  // Half-recovery art switches at the midpoint of remaining WORK, so it lands at
  // the right point when a boost has shrunk the remaining duration.
  const halfThreshold =
    baseDurationMs !== undefined
      ? baseDurationMs / 2000
      : OIL_RESERVE_RECOVERY_TIME / 2;
  const halfReady = !ready && timeLeft <= halfThreshold;

  const handleDrill = async () => {
    if (!ready || drills.lessThan(requiredDrillAmount)) return;

    gameService.send({ type: "oilReserve.drilled", id });

    setDrilling(true);
    setOilHarvested((oilHarvested) => oilHarvested + oilDropAmount);

    await new Promise((res) => setTimeout(res, 2000));
    setDrilling(false);
  };
  const hasDrill = drills.gte(requiredDrillAmount);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {ready && (
        <RecoveredOilReserve
          bonusDrill={isNextDrillHasBonus(reserve)}
          hasDrill={hasDrill}
          onDrill={handleDrill}
        />
      )}
      {halfReady && <RecoveringOilReserve timeLeft={timeLeft} speed={speed} />}
      {!ready && !halfReady && (
        <DepletedOilReserve
          drilling={drilling}
          oilAmount={oilHarvested}
          timeLeft={timeLeft}
          speed={speed}
          onOilTransitionEnd={() => setOilHarvested(0)}
        />
      )}
    </div>
  );
};
