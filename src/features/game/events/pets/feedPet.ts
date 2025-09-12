import { isTemporaryCollectibleActive } from "features/game/lib/collectibleBuilt";
import { CookableName } from "features/game/types/consumables";
import { GameState } from "features/game/types/game";
import {
  getPetLevel,
  getPetRequestXP,
  isPetNapping,
  isPetNeglected,
  Pet,
  PET_REQUESTS,
  PetName,
} from "features/game/types/pets";
import { produce } from "immer";

export function getPetEnergy({
  petData,
  basePetEnergy,
}: {
  petData: Pet;
  basePetEnergy: number;
}) {
  const { level: petLevel } = getPetLevel(petData.experience);
  let boostEnergy = 0;

  if (petLevel >= 5) {
    boostEnergy += 5;
  }

  if (petLevel >= 35) {
    boostEnergy += 5;
  }

  if (petLevel >= 75) {
    boostEnergy += 5;
  }

  return basePetEnergy + boostEnergy;
}

export function getPetExperience({
  game,
  basePetXP,
}: {
  game: GameState;
  basePetXP: number;
}) {
  let experience = basePetXP;

  if (isTemporaryCollectibleActive({ name: "Hound Shrine", game })) {
    experience += 100;
  }

  return experience;
}

/**
 * Removes the hard request from the pet's food requests if the pet is less than level 10
 * This ensures that the pet would instantly get the hard request when it reaches level 10
 * @param pet Pet
 * @returns Pet's food requests
 */
export function getPetFoodRequests(pet: Pet) {
  const { level: petLevel } = getPetLevel(pet.experience);
  let requests = [...pet.requests.food];

  if (petLevel < 10) {
    const hardRequest = requests.find((request) =>
      PET_REQUESTS.hard.includes(request),
    );

    if (hardRequest) {
      requests = requests.filter((request) => request !== hardRequest);
    }
  }
  return requests;
}
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

    const requests = getPetFoodRequests(petData);
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

    // Get base pet XP/Energy
    const basePetXP = getPetRequestXP(food);

    const experience = getPetExperience({ basePetXP, game: stateCopy });
    const energy = getPetEnergy({ petData, basePetEnergy: basePetXP });
    petData.experience += experience;
    petData.energy += energy;

    return stateCopy;
  });
}
