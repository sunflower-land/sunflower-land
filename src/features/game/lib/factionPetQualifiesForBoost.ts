import { FactionPetRequest } from "features/game/types/game";
import { getKeys } from "lib/object";

/**
 * Whether the player fed each faction pet request at least once in the week
 * that just ended (used when rolling into a new week).
 *
 * Must stay aligned with `qualifiesForFactionPetBoostFromPriorWeekRequests` in
 * sunflower-land-api `domain/game/types/factionPet.ts`.
 *
 * Empty prior-week request data must not qualify — `Array.prototype.every` on
 * `[]` is vacuously true in JavaScript, which incorrectly boosted new members.
 */
export function qualifiesForFactionPetBoostFromPriorWeekRequests(
  priorWeekRequests: FactionPetRequest[],
): boolean {
  if (priorWeekRequests.length === 0) return false;
  return priorWeekRequests.every(
    (request) => getKeys(request.dailyFulfilled ?? {}).length > 0,
  );
}
