import type { GameState } from "features/game/types/game";
import { hasHitHelpLimit } from "features/game/types/monuments";
import {
  hasHitSocialPetLimit,
  type PetName,
  SOCIAL_PET_XP_PER_HELP,
} from "features/game/types/pets";
import { getKeys } from "lib/object";
import { produce } from "immer";

export type HelpAllPetsInHouseAction = {
  type: "pet.helpAllPetsInHouse";
  totalHelpedToday: number;
};

type Options = {
  state: Readonly<GameState>;
  action: HelpAllPetsInHouseAction;
  createdAt?: number;
  visitorState?: GameState;
};

export function helpAllPetsInHouse({
  state,
  action,
  visitorState,
  createdAt = Date.now(),
}: Options): [GameState, GameState] {
  return produce([state, visitorState!], ([game, visitorGame]) => {
    if (
      hasHitHelpLimit({
        game: visitorGame,
        totalHelpedToday: action.totalHelpedToday,
      })
    ) {
      throw new Error("Help limit reached");
    }

    const isPetHousePlaced = !!game.buildings["Pet House"]?.some(
      (b) => !!b.coordinates,
    );

    if (!isPetHousePlaced) {
      throw new Error("Pet House is not placed");
    }

    const day = new Date(createdAt).toISOString().slice(0, 10);

    const petHousePets = game.petHouse?.pets ?? {};

    for (const name of getKeys(petHousePets)) {
      const isPlaced = petHousePets[name]?.some((item) => !!item.coordinates);
      if (!isPlaced) continue;

      const pet = game.pets?.common?.[name as PetName];
      if (!pet || pet.visitedAt) continue;

      if (!hasHitSocialPetLimit(pet)) {
        const dailySocialXP = pet.dailySocialXP?.[day] ?? 0;
        pet.dailySocialXP = pet.dailySocialXP ?? {};
        pet.dailySocialXP[day] = dailySocialXP + SOCIAL_PET_XP_PER_HELP;
        pet.experience = (pet.experience ?? 0) + SOCIAL_PET_XP_PER_HELP;
      }

      pet.visitedAt = createdAt;
    }

    for (const id of getKeys(game.pets?.nfts ?? {})) {
      const pet = game.pets?.nfts?.[id];
      if (!pet || pet.visitedAt || pet.location !== "petHouse") continue;

      if (!hasHitSocialPetLimit(pet)) {
        const dailySocialXP = pet.dailySocialXP?.[day] ?? 0;
        pet.dailySocialXP = pet.dailySocialXP ?? {};
        pet.dailySocialXP[day] = dailySocialXP + SOCIAL_PET_XP_PER_HELP;
        pet.experience = (pet.experience ?? 0) + SOCIAL_PET_XP_PER_HELP;
      }

      pet.visitedAt = createdAt;
    }
  });
}
