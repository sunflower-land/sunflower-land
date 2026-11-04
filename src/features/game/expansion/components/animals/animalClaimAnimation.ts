import Decimal from "decimal.js-light";
import type { Animal } from "features/game/types/game";
import { addAnimalExperience } from "features/game/lib/animals";

/** Recreate the claimed animal for animation without changing the saved state. */
export function getAnimalClaimSnapshot(before: Animal, after: Animal): Animal {
  if (before.state === "ready") return before;

  // Feed All can feed and claim in one event, so the ready record was never
  // rendered. Replay only its XP gain on a copy, retaining pre-claim buffs.
  const snapshot = {
    ...before,
    pendingProduceLevels: before.pendingProduceLevels?.slice(),
  };
  addAnimalExperience(
    snapshot,
    new Decimal(after.experience).sub(before.experience).toNumber(),
  );

  return { ...snapshot, state: "ready" };
}
