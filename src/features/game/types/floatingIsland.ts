import { GameState } from "./game";

export function getActiveFloatingIsland({ state }: { state: GameState }) {
  const schedule = state.floatingIsland.schedule;
  const now = Date.now();
  return schedule.find(
    (schedule) => now >= schedule.startAt && now <= schedule.endAt,
  );
}
