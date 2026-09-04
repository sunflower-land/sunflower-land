import React, { useContext, useState } from "react";
import { RecoveredOilReserve } from "./components/RecoveredOilReserve";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { OilReserve as IOilReserve } from "features/game/types/game";
import { useSelector } from "@xstate/react";
import { useNow } from "lib/utils/hooks/useNow";
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
  areBoostWindowsEqual,
  getOilBoostWindows,
} from "features/game/lib/boostWindows";
import { useNodeTimer } from "features/game/lib/useNodeTimer";
import { PRE_ACTION_TICK_MS } from "features/game/lib/timerDisplay";

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

export const OilReserve: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  // The Stag Shrine's +15 bonus oil is only granted while the shrine is active,
  // so the yield preview needs a LIVE clock — a mount snapshot would keep
  // promising the bonus long after the shrine expired. One tick a minute is
  // enough for a boost that flips at most a few times a day.
  const now = useNow({ live: true, intervalMs: PRE_ACTION_TICK_MS });
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
        ? getOilDropAmount(state.context.state, oilReserve, now).amount
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
    now: timerNow,
    readyAt,
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
      {halfReady && (
        <RecoveringOilReserve
          timeLeft={timeLeft}
          speed={speed}
          readyAt={readyAt}
          now={timerNow}
        />
      )}
      {!ready && !halfReady && (
        <DepletedOilReserve
          drilling={drilling}
          oilAmount={oilHarvested}
          timeLeft={timeLeft}
          speed={speed}
          readyAt={readyAt}
          now={timerNow}
          onOilTransitionEnd={() => setOilHarvested(0)}
        />
      )}
    </div>
  );
};
