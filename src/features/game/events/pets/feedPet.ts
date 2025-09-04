import { CookableName } from "features/game/types/consumables";
import { GameState } from "features/game/types/game";
import {
  getPetRequestXP,
  isPetNapping,
  isPetNeglected,
  PetName,
} from "features/game/types/pets";
import { produce } from "immer";

export type FeedPetAction = {
  type: "pet.fed";
  pet: PetName;
  food: CookableName;
};

type Options = {
  state: GameState;
  action: FeedPetAction;
  createdAt?: number;
};

export function feedPet({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { pet, food } = action;

    const petData = stateCopy.pets?.common?.[pet];

    if (!petData) {
      throw new Error("Pet not found");
    }

    if (isPetNapping(petData, createdAt)) {
      throw new Error("Pet is napping");
    }

    if (isPetNeglected(petData, createdAt)) {
      throw new Error("Pet is in neglected state");
    }

    const requests = petData.requests.food;
    if (requests.length <= 0) {
      throw new Error("No requests found");
    }

    if (!requests.includes(food)) {
      throw new Error("Food not found");
    }

    const lastFedAt = petData.requests.fedAt;
    const foodFed = petData.requests.foodFed;

    const todayDate = new Date(createdAt).toISOString().split("T")[0];
    const lastFedAtDate = new Date(lastFedAt ?? 0).toISOString().split("T")[0];
    const isToday = lastFedAtDate === todayDate;

    if (foodFed?.includes(food) && isToday) {
      throw new Error("Food has been fed today");
    }

    const { inventory } = stateCopy;

    const foodInInventory = inventory[food];
    if (!foodInInventory || foodInInventory.lessThan(1)) {
      throw new Error("Not enough food in inventory");
    }

    //   Update Food Fed
    if (!isToday || !petData.requests.foodFed) {
      petData.requests.foodFed = [];
    }
    petData.requests.foodFed.push(food);
    petData.requests.fedAt = createdAt;
    inventory[food] = foodInInventory.minus(1);

    const experience = getPetRequestXP(food);
    petData.experience += experience;
    petData.energy += experience;

    return stateCopy;
  });
}
