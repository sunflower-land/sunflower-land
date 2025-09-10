import { GameState } from "features/game/types/game";
import { PetName } from "features/game/types/pets";
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

    pet.visitedAt = createdAt;
  });
}
