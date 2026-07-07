import type { GameState } from "features/game/types/game";
import type { PetName, PetResourceName } from "features/game/types/pets";
import { fetchPet, PetNotEnoughEnergyError } from "./fetchPet";

export type BulkFetchPetsAction = {
  type: "pets.bulkFetch";
  fetches: {
    petId: PetName | number;
    fetch: PetResourceName;
    amount: number;
  }[];
};

type Options = {
  state: GameState;
  action: BulkFetchPetsAction;
  createdAt?: number;
};

export function bulkFetchPets({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  // `fetchPet` already returns a fresh immutable state, so chain the calls in a
  // plain reducer loop. Throwing mid-loop discards `nextState`, so an invalid
  // entry rejects the whole event rather than committing a partial result.
  let nextState = state;

  action.fetches.forEach(({ petId, fetch, amount }) => {
    if (!Number.isInteger(amount) || amount < 0) {
      throw new Error("Invalid bulk fetch amount");
    }

    for (let i = 0; i < amount; i++) {
      try {
        nextState = fetchPet({
          state: nextState,
          action: { type: "pet.fetched", petId, fetch },
          createdAt,
        });
      } catch (error) {
        // Running out of energy is the expected "this pet is done" signal, so
        // move on to the next entry. Anything else means the action is
        // malformed or stale, so let it surface.
        if (error instanceof PetNotEnoughEnergyError) break;
        throw error;
      }
    }
  });

  return nextState;
}
