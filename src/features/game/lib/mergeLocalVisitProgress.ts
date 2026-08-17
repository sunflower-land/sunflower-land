import { getKeys } from "lib/object";
import type { GameState } from "../types/game";

/**
 * LOCAL_VISITING_EVENTS (e.g. pet.helpAllPetsInHouse, project.helped)
 * mutate the visited farm's state on the client only - they're deliberately
 * excluded from `context.actions` so they never reach the backend (see the
 * actions filter in playingEventHandler in gameMachine.ts).
 *
 * When a visit *effect* (farm.helped/farm.cheered) later completes, the
 * backend returns its own fresh snapshot of the visited farm and that
 * fully replaces `context.state`. Without this merge, that overwrite wipes
 * out any local-only help progress made just before the effect fired -
 * e.g. a visitor helps the Pet House, then closes the "Helped" popup
 * (which fires the farm.helped effect); the fresh snapshot has no record
 * of the Pet House help, so its "needs help" badge reappears and clicking
 * it again re-attempts to help instead of entering.
 */
export function mergeLocalVisitProgress(
  freshState: GameState,
  localState: GameState,
): GameState {
  const mergedCommonPets = { ...freshState.pets?.common };
  getKeys(localState.pets?.common ?? {}).forEach((name) => {
    const freshPet = mergedCommonPets[name];
    const localVisitedAt = localState.pets?.common?.[name]?.visitedAt;

    if (freshPet && localVisitedAt) {
      mergedCommonPets[name] = { ...freshPet, visitedAt: localVisitedAt };
    }
  });

  const mergedNftPets = { ...freshState.pets?.nfts };
  getKeys(localState.pets?.nfts ?? {}).forEach((id) => {
    const freshPet = mergedNftPets[id];
    const localVisitedAt = localState.pets?.nfts?.[id]?.visitedAt;

    if (freshPet && localVisitedAt) {
      mergedNftPets[id] = { ...freshPet, visitedAt: localVisitedAt };
    }
  });

  const mergedVillageProjects = { ...freshState.socialFarming.villageProjects };
  getKeys(localState.socialFarming.villageProjects).forEach((name) => {
    const freshProject = mergedVillageProjects[name];
    const localHelpedAt =
      localState.socialFarming.villageProjects[name]?.helpedAt;

    if (freshProject && localHelpedAt) {
      mergedVillageProjects[name] = {
        ...freshProject,
        helpedAt: localHelpedAt,
      };
    }
  });

  return {
    ...freshState,
    pets: { ...freshState.pets, common: mergedCommonPets, nfts: mergedNftPets },
    socialFarming: {
      ...freshState.socialFarming,
      villageProjects: mergedVillageProjects,
    },
  };
}
