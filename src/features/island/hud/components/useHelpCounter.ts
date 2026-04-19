import { useSelector } from "@xstate/react";
import { useEffect, useMemo, useState } from "react";
import { loadGameStateForVisit } from "features/game/actions/loadGameStateForVisit";
import type {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { getHelpLimit } from "features/game/types/monuments";
import { CONFIG } from "lib/config";

const _farmId = (state: MachineState) => state.context.farmId;
const _visitorId = (state: MachineState) => state.context.visitorId;
const _rawToken = (state: MachineState) => state.context.rawToken;
const _game = (state: MachineState) =>
  state.context.visitorState ?? state.context.state;
const _totalHelpedToday = (state: MachineState) =>
  state.context.totalHelpedToday;

const getTodayKey = () => new Date().toISOString().split("T")[0];

const getHelpCounterCacheKey = (farmId: number) =>
  `daily-help-counter:${farmId}:${getTodayKey()}`;

export const getCachedHelpCounter = (farmId: number) => {
  const value = localStorage.getItem(getHelpCounterCacheKey(farmId));

  if (value == null) return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

export const cacheHelpCounter = (farmId: number, usedToday: number) => {
  localStorage.setItem(getHelpCounterCacheKey(farmId), String(usedToday));
};

export const useSyncHelpCounterCache = (gameService: MachineInterpreter) => {
  const visitorId = useSelector(gameService, _visitorId);
  const farmId = useSelector(gameService, _farmId);
  const totalHelpedToday = useSelector(gameService, _totalHelpedToday);
  const ownFarmId = visitorId ?? farmId;

  useEffect(() => {
    if (ownFarmId == null || totalHelpedToday == null) return;

    cacheHelpCounter(ownFarmId, totalHelpedToday);
  }, [ownFarmId, totalHelpedToday]);
};

export const useHelpCounter = (gameService: MachineInterpreter) => {
  const visitorId = useSelector(gameService, _visitorId);
  const farmId = useSelector(gameService, _farmId);
  const rawToken = useSelector(gameService, _rawToken);
  const game = useSelector(gameService, _game);
  const totalHelpedToday = useSelector(gameService, _totalHelpedToday);
  const ownFarmId = visitorId ?? farmId;
  const cachedUsedToday = useMemo(
    () => getCachedHelpCounter(ownFarmId) ?? 0,
    [ownFarmId],
  );
  const [fetchedHelpData, setFetchedHelpData] = useState<{
    farmId: number;
    usedToday: number;
  }>();

  useEffect(() => {
    if (totalHelpedToday == null) return;

    cacheHelpCounter(ownFarmId, totalHelpedToday);
  }, [ownFarmId, totalHelpedToday]);

  useEffect(() => {
    if (visitorId != null) return;
    if (!CONFIG.API_URL || !rawToken) return;

    let isActive = true;

    loadGameStateForVisit(ownFarmId, rawToken)
      .then(({ totalHelpedToday }) => {
        if (!isActive) return;

        setFetchedHelpData({
          farmId: ownFarmId,
          usedToday: totalHelpedToday,
        });
        cacheHelpCounter(ownFarmId, totalHelpedToday);
      })
      .catch(() => {
        // Ignore fetch failures and fall back to cached data if present.
      });

    return () => {
      isActive = false;
    };
  }, [ownFarmId, rawToken, visitorId]);

  return useMemo(() => {
    const fetchedUsedToday =
      fetchedHelpData?.farmId === ownFarmId
        ? fetchedHelpData.usedToday
        : undefined;
    const usedToday =
      totalHelpedToday ?? fetchedUsedToday ?? cachedUsedToday ?? 0;
    const total = getHelpLimit({ game });

    return {
      remaining: Math.max(total - usedToday, 0),
      total,
    };
  }, [cachedUsedToday, fetchedHelpData, game, ownFarmId, totalHelpedToday]);
};
