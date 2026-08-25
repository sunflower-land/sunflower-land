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
import {
  getOilBoostWindows,
  type BoostWindow,
} from "features/game/lib/boostWindows";
import { useNodeTimer } from "features/game/lib/useNodeTimer";

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
  const {
    speed,
    workLeftSeconds,
    displaySeconds: timeLeft,
  } = useNodeTimer({
    startedAt: drilledAt,
    baseDurationMs,
    windows: oilBoostWindows,
    legacyReadyAt: drilledAt + OIL_RESERVE_RECOVERY_TIME * 1000,
  });

  // Readiness and the half-recovery art both key off remaining WORK, never the
  // displayed reading — the reserve is equally full whichever the player has
  // chosen to see. The threshold is the midpoint of that work.
  const ready = workLeftSeconds <= 0;
  const halfThreshold =
    baseDurationMs !== undefined
      ? baseDurationMs / 2000
      : OIL_RESERVE_RECOVERY_TIME / 2;
  const halfReady = !ready && workLeftSeconds <= halfThreshold;

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
