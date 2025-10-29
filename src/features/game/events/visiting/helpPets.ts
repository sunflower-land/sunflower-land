import { GameState } from "features/game/types/game";
import {
  PetName,
  SOCIAL_PET_DAILY_XP_LIMIT,
  SOCIAL_PET_XP_PER_HELP,
} from "features/game/types/pets";
import { produce } from "immer";
import { hasHitHelpLimit } from "../landExpansion/increaseHelpLimit";

export type HelpPetsAction = {
  type: "pet.visitingPets";
  pet: PetName;
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

    const pet = game.pets?.common?.[action.pet];

    if (!pet) {
      throw new Error("Pet not found");
    }

    const day = new Date(createdAt).toISOString().slice(0, 10);
    const dailySocialXP = pet.dailySocialXP?.[day] ?? 0;

    if (dailySocialXP >= SOCIAL_PET_DAILY_XP_LIMIT) {
      throw new Error("Pet social limit reached");
    }

    const experienceAward = Math.min(
      SOCIAL_PET_XP_PER_HELP,
      SOCIAL_PET_DAILY_XP_LIMIT - dailySocialXP,
    );

    pet.dailySocialXP = pet.dailySocialXP ?? {};
    pet.dailySocialXP[day] = dailySocialXP + experienceAward;
    pet.experience = (pet.experience ?? 0) + experienceAward;
    pet.visitedAt = createdAt;
  });
}
