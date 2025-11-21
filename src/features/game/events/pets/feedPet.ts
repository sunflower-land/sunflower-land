import { getObjectEntries } from "features/game/expansion/lib/utils";
import {
  isCollectibleBuilt,
  isTemporaryCollectibleActive,
} from "features/game/lib/collectibleBuilt";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { CookableName } from "features/game/types/consumables";
import { GameState } from "features/game/types/game";
import {
  getPetLevel,
  getPetRequestXP,
  isPetNapping,
  isPetNeglected,
  isPetNFT as isPetNFTData,
  isPetOfTypeFed,
  Pet,
  PET_REQUESTS,
  PetName,
  PetNFT,
  PetRequestDifficulty,
} from "features/game/types/pets";
import { getCurrentSeason } from "features/game/types/seasons";
import { AuraTrait, BibTrait } from "features/pets/data/types";
import { produce } from "immer";
import { setPrecision } from "lib/utils/formatNumber";

// Build a constant-time lookup from food -> difficulty
export const FOOD_TO_DIFFICULTY: Map<CookableName, PetRequestDifficulty> =
  (() => {
    const map = new Map<CookableName, PetRequestDifficulty>();
    getObjectEntries(PET_REQUESTS).forEach(([difficulty, foods]) => {
      foods.forEach((food) => map.set(food, difficulty));
    });
    return map;
  })();

const AURA_ENERGY_MULTIPLIER: Record<AuraTrait, number> = {
  "No Aura": 1,
  "Common Aura": 1.5,
  "Rare Aura": 2,
  "Mythic Aura": 3,
};

export function getPetEnergy({
  game,
  basePetEnergy,
  petLevel,
  petData,
  createdAt = Date.now(),
}: {
  game: GameState;
  basePetEnergy: number;
  petLevel: number;
  petData: Pet | PetNFT;
  createdAt?: number;
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

  let energy = basePetEnergy + boostEnergy;

  // Apply aura multiplier if the pet is a PetNFT and has an aura trait
  if (isPetNFTData(petData) && petData.traits?.aura) {
    const auraMultiplier = AURA_ENERGY_MULTIPLIER[petData.traits.aura];
    energy *= auraMultiplier;
  }

  // To remove after current chapter
  if (
    hasVipAccess({ game, now: createdAt }) &&
    getCurrentSeason(new Date(createdAt)) === "Paw Prints"
  ) {
    energy += 5;
  }

  return setPrecision(energy, 2).toNumber();
}

const BIB_EXPERIENCE_BONUS: Record<BibTrait, number> = {
  "Baby Bib": 0,
  Collar: 5,
  "Gold Necklace": 10,
};

export function getPetExperience({
  game,
  basePetXP,
  petLevel,
  petData,
}: {
  game: GameState;
  basePetXP: number;
  petLevel: number;
  petData: Pet | PetNFT;
}) {
  let experience = basePetXP;
  let experienceBoost = 1;

  const isPetNFT = isPetNFTData(petData);

  if (petLevel >= 27) {
    experienceBoost += 0.1;
  }

  if (petLevel >= 40 && isPetNFT) {
    experienceBoost += 0.15;
  }

  if (petLevel >= 85 && isPetNFT) {
    experienceBoost += 0.25;
  }

  experience *= experienceBoost;

  if (isTemporaryCollectibleActive({ name: "Hound Shrine", game })) {
    experience += 100;
  }

  if (isCollectibleBuilt({ name: "Pet Bowls", game })) {
    experience += 10;
  }

  if (isPetNFT && petData.traits?.bib) {
    experience += BIB_EXPERIENCE_BONUS[petData.traits.bib];
  }

  return setPrecision(experience, 2).toNumber();
}
/**
 * Returns the pet's food requests based on its level and type (Pet or PetNFT).
 * For PetNFTs, the number and difficulty of food requests are limited depending on the pet's level:
 *  - Below level 30: 1 easy, 1 medium, and 1 hard request.
 *  - Level 30 to 199: 1 easy, 2 medium, and 1 hard request.
 *  - Level 200 and above: all requests are included.
 * For regular Pets
 *  - Below level 10: 1 easy and 1 medium request.
 *  - Level 10 and above: 1 easy, 1 medium, and 1 hard request.
 * @param pet The pet object (Pet or PetNFT)
 * @param petLevel The current level of the pet
 * @returns The filtered list of food requests for the pet
 */
export function getPetFoodRequests(
  pet: Pet | PetNFT,
  petLevel: number,
): CookableName[] {
  const requests = [...pet.requests.food];

  const isNFT = isPetNFTData(pet);

  if (isNFT) {
    if (petLevel < 30) {
      // If pet is below level 30, keep only 1 easy, 1 medium, and 1 hard request
      const filteredRequests: CookableName[] = [];
      let hasEasy = false;
      let hasMedium = false;
      let hasHard = false;
      for (const food of requests) {
        const difficulty = FOOD_TO_DIFFICULTY.get(food);
        if (difficulty === "easy" && !hasEasy) {
          filteredRequests.push(food);
          hasEasy = true;
        } else if (difficulty === "medium" && !hasMedium) {
          filteredRequests.push(food);
          hasMedium = true;
        } else if (difficulty === "hard" && !hasHard) {
          filteredRequests.push(food);
          hasHard = true;
        }
        if (filteredRequests.length === 3) break;
      }
      return filteredRequests;
    }
    if (petLevel < 200) {
      // If pet is below level 200, keep only 1 easy, 2 medium, and 1 hard request
      const filteredRequests: CookableName[] = [];
      let easyCount = 0;
      let mediumCount = 0;
      let hardCount = 0;

      for (const food of requests) {
        const difficulty = FOOD_TO_DIFFICULTY.get(food);
        if (difficulty === "easy" && easyCount < 1) {
          filteredRequests.push(food);
          easyCount++;
        } else if (difficulty === "medium" && mediumCount < 2) {
          filteredRequests.push(food);
          mediumCount++;
        } else if (difficulty === "hard" && hardCount < 1) {
          filteredRequests.push(food);
          hardCount++;
        }
        // Stop if we have all 4 requests
        if (filteredRequests.length === 4) break;
      }
      return filteredRequests;
    } else {
      // If pet is above level 200, keep all requests ( 1 easy, 2 medium, and 2 hard requests)
      return requests;
    }
  } else {
    if (petLevel < 10) {
      // If pet is below level 10, keep only 1 easy and 1 medium request
      const filteredRequests: CookableName[] = [];
      for (const food of requests) {
        const difficulty = FOOD_TO_DIFFICULTY.get(food);
        if (difficulty && difficulty !== "hard") {
          filteredRequests.push(food);
          if (filteredRequests.length === 2) break;
        }
      }
      return filteredRequests;
    } else {
      // If pet is above level 10, keep all requests ( 1 easy, 1 medium, 1 hard request)
      return requests;
    }
  }
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

    const isNFTData = isPetNFTData(petData);

    const isPetPlaced = isNFTData
      ? !!petData.coordinates
      : !!isCollectibleBuilt({ name: petData.name, game: stateCopy });

    if (!isPetPlaced) {
      throw new Error("Pet is not placed");
    }

    if (isNFTData) {
      if (!petData.traits) {
        throw new Error("Pet traits not found");
      }

      const isPetTypeFed = isPetOfTypeFed({
        nftPets: stateCopy.pets?.nfts ?? {},
        petType: petData.traits.type,
        id: petData.id,
        now: createdAt,
      });

      if (isPetTypeFed) {
        throw new Error("Pet of type has been fed today");
      }
    }

    const { level: petLevel } = getPetLevel(petData.experience);

    const requests = getPetFoodRequests(petData, petLevel);
    if (requests.length <= 0) {
      throw new Error("No requests found");
    }

    if (!requests.includes(food)) {
      throw new Error("Food not found");
    }

    const foodFed = petData.requests.foodFed;

    if (foodFed?.includes(food)) {
      throw new Error("Food has been fed today");
    }

    const { inventory } = stateCopy;

    const foodInInventory = inventory[food];
    if (!foodInInventory || foodInInventory.lessThan(1)) {
      throw new Error("Not enough food in inventory");
    }

    //   Update Food Fed
    if (!petData.requests.foodFed) {
      petData.requests.foodFed = [];
    }
    petData.requests.foodFed.push(food);
    petData.requests.fedAt = createdAt;
    inventory[food] = foodInInventory.minus(1);

    // Get base pet XP/Energy
    const basePetXP = getPetRequestXP(food);

    const experience = getPetExperience({
      basePetXP,
      game: stateCopy,
      petLevel,
      petData,
    });
    const energy = getPetEnergy({
      game: stateCopy,
      petLevel,
      basePetEnergy: basePetXP,
      petData,
      createdAt,
    });
    petData.experience += experience;
    petData.energy += energy;

    return stateCopy;
  });
}
