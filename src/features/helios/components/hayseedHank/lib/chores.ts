import { ChoresV2 } from "features/game/types/game";

export function hasNewChores(chores: ChoresV2) {
  const stored = localStorage.getItem(`chores.read`);

  const acknowledged: string[] = stored ? JSON.parse(stored) : [];

  const currentIds = Object.entries(chores.chores)
    .filter(([, chore]) => !chore.completedAt)
    .map(([id]) => id);

  return currentIds.some((id) => !acknowledged.includes(id));
}

export function acknowledgeChores(chores: ChoresV2) {
  const ids = Object.entries(chores.chores)
    .filter(([, chore]) => !chore.completedAt)
    .map(([id]) => id);

  localStorage.setItem(`chores.read`, JSON.stringify(ids));
}
