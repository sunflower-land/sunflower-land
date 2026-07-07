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

// Defensive upper bounds matching the backend autosave schema, so the handler
// rejects oversized input early regardless of where it is called (the FE path
// has no schema validation). The PetNotEnoughEnergyError short-circuit below
// still keeps the real work proportional to each pet's available energy.
const MAX_BULK_FETCH_ENTRIES = 140; // 10 resources x up to 14 pets
const MAX_BULK_FETCH_AMOUNT = 1000; // per (pet, resource)

export function bulkFetchPets({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  if (action.fetches.length > MAX_BULK_FETCH_ENTRIES) {
    throw new Error("Too many bulk fetch entries");
  }

  // `fetchPet` already returns a fresh immutable state, so chain the calls in a
  // plain reducer loop. Throwing mid-loop discards `nextState`, so an invalid
  // entry rejects the whole event rather than committing a partial result.
  let nextState = state;

  action.fetches.forEach(({ petId, fetch, amount }) => {
    if (
      !Number.isInteger(amount) ||
      amount < 0 ||
      amount > MAX_BULK_FETCH_AMOUNT
    ) {
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
