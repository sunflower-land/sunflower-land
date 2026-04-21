import { useSelector } from "@xstate/react";
import { useEffect, useMemo, useState } from "react";
import type {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { getHelpLimit } from "features/game/types/monuments";

const _farmId = (state: MachineState) => state.context.farmId;
const _visitorId = (state: MachineState) => state.context.visitorId;
const _game = (state: MachineState) =>
  state.context.visitorState ?? state.context.state;
const _totalHelpedToday = (state: MachineState) =>
  state.context.totalHelpedToday;

const getTodayKey = () => new Date().toISOString().split("T")[0];

const getMsUntilNextUtcDay = () => {
  const now = new Date();
  const nextUtcDay = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );

  return nextUtcDay - now.getTime();
};

const useTodayKey = () => {
  const [todayKey, setTodayKey] = useState(getTodayKey);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setTodayKey(getTodayKey());
    }, getMsUntilNextUtcDay() + 1000);

    return () => window.clearTimeout(timeout);
  }, [todayKey]);

  return todayKey;
};

const getHelpCounterCacheKey = (farmId: number, todayKey = getTodayKey()) =>
  `daily-help-counter:${farmId}:${todayKey}`;

export const getCachedHelpCounter = (farmId: number, todayKey?: string) => {
  const value = localStorage.getItem(getHelpCounterCacheKey(farmId, todayKey));

  if (value == null) return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

export const cacheHelpCounter = (
  farmId: number,
  usedToday: number,
  todayKey?: string,
) => {
  localStorage.setItem(
    getHelpCounterCacheKey(farmId, todayKey),
    String(usedToday),
  );
};

export const useHelpCounter = (gameService: MachineInterpreter) => {
  const visitorId = useSelector(gameService, _visitorId);
  const farmId = useSelector(gameService, _farmId);
  const game = useSelector(gameService, _game);
  const totalHelpedToday = useSelector(gameService, _totalHelpedToday);
  const ownFarmId = visitorId ?? farmId;
  const todayKey = useTodayKey();
  const cachedUsedToday = useMemo(
    () => getCachedHelpCounter(ownFarmId, todayKey),
    [ownFarmId, todayKey],
  );

  useEffect(() => {
    if (totalHelpedToday == null) return;

    cacheHelpCounter(ownFarmId, totalHelpedToday, todayKey);
  }, [ownFarmId, todayKey, totalHelpedToday]);

  return useMemo(() => {
    const usedToday = totalHelpedToday ?? cachedUsedToday;
    const total = getHelpLimit({ game });

    return {
      remaining: usedToday == null ? undefined : Math.max(total - usedToday, 0),
      total,
    };
  }, [cachedUsedToday, game, totalHelpedToday]);
};
