import { getObjectEntries } from "features/game/expansion/lib/utils";
import { CookableName } from "features/game/types/consumables";
import { GameState } from "features/game/types/game";
import { PetName } from "features/game/types/pets";
import { produce } from "immer";
import { feedPet } from "./feedPet";

export type BulkFeedPetsAction = {
  type: "pets.bulkFeed";
  pets: {
    petId: PetName | number;
    food: CookableName;
  }[];
};

type Options = {
  state: GameState;
  action: BulkFeedPetsAction;
  createdAt?: number;
};

export function bulkFeedPets({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const { pets } = action;

  const foodRequired = pets.reduce<Partial<Record<CookableName, number>>>(
    (acc, pet) => {
      acc[pet.food] = (acc[pet.food] ?? 0) + 1;
      return acc;
    },
    {},
  );

  getObjectEntries(foodRequired).forEach(([food, amount]) => {
    const foodInInventory = state.inventory[food];
    if (!foodInInventory || foodInInventory.lt(amount ?? 0)) {
      throw new Error("Not enough food in inventory");
    }
  });

  return produce(state, (stateCopy) => {
    pets.forEach((pet) => {
      try {
        stateCopy = feedPet({
          state: stateCopy,
          action: { ...pet, type: "pet.fed" },
          createdAt,
        });
      } catch (error) {
        // ignore error
      }
    });

    return stateCopy;
  });
}
