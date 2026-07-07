import type { GameState } from "features/game/types/game";
import type { PetName, PetResourceName } from "features/game/types/pets";
import { produce } from "immer";
import { fetchPet } from "./fetchPet";

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
  const { fetches } = action;

  return produce(state, (stateCopy) => {
    fetches.forEach(({ petId, fetch, amount }) => {
      // `amount` is an upper bound from the FE plan; each fetch re-validates
      // energy/level/napping/neglect, so we simply stop once one fails.
      for (let i = 0; i < amount; i++) {
        try {
          stateCopy = fetchPet({
            state: stateCopy,
            action: { type: "pet.fetched", petId, fetch },
            createdAt,
          });
        } catch (error) {
          break;
        }
      }
    });

    return stateCopy;
  });
}
