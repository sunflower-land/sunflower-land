import { GameState } from "features/game/types/game";
import { hasHitHelpLimit } from "features/game/types/monuments";
import {
  hasHitSocialPetLimit,
  PetName,
  SOCIAL_PET_XP_PER_HELP,
} from "features/game/types/pets";
import { produce } from "immer";

export type HelpPetsAction = {
  type: "pet.visitingPets";
  pet: PetName | number;
  totalHelpedToday: number;
};

type Options = {
  state: Readonly<GameState>;
  action: HelpPetsAction;
  createdAt?: number;
  visitorState?: GameState;
};

export function helpPets({
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

    const pet =
      typeof action.pet === "number"
        ? game.pets?.nfts?.[action.pet]
        : game.pets?.common?.[action.pet];

    if (!pet) {
      throw new Error("Pet not found");
    }

    // If the pet has not hit the social limit, add the social XP
    if (!hasHitSocialPetLimit(pet)) {
      const day = new Date(createdAt).toISOString().slice(0, 10);
      const dailySocialXP = pet.dailySocialXP?.[day] ?? 0;

      pet.dailySocialXP = pet.dailySocialXP ?? {};
      pet.dailySocialXP[day] = dailySocialXP + SOCIAL_PET_XP_PER_HELP;
      pet.experience = (pet.experience ?? 0) + SOCIAL_PET_XP_PER_HELP;
    }

    pet.visitedAt = createdAt;
  });
}
