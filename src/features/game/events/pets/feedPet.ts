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
  PetNFT,
} from "features/game/types/pets";
import { produce } from "immer";

export function getPetEnergy({
  basePetEnergy,
  petLevel,
}: {
  basePetEnergy: number;
  petLevel: number;
}) {
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
export function getPetFoodRequests(pet: Pet | PetNFT, petLevel: number) {
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
  petId: PetName | number;
  food: CookableName;
};

type Options = {
  state: GameState;
  action: FeedPetAction;
  createdAt?: number;
};

export function feedPet({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { petId, food } = action;

    const isPetNFT = typeof petId === "number";

    const petData = isPetNFT
      ? stateCopy.pets?.nfts?.[petId]
      : stateCopy.pets?.common?.[petId];

    if (!petData) {
      throw new Error("Pet not found");
    }

    if (isPetNapping(petData, createdAt)) {
      throw new Error("Pet is napping");
    }

    if (isPetNeglected(petData, createdAt)) {
      throw new Error("Pet is in neglected state");
    }

    const { level: petLevel } = getPetLevel(petData.experience);

    const requests = getPetFoodRequests(petData, petLevel);
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
    const energy = getPetEnergy({ petLevel, basePetEnergy: basePetXP });
    petData.experience += experience;
    petData.energy += energy;

    return stateCopy;
  });
}
