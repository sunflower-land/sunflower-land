import { produce } from "immer";
import type { GameState } from "features/game/types/game";

export enum REMOVE_ASCENSION_CRYSTAL_ERRORS {
  ASCENSION_CRYSTAL_NOT_FOUND = "Ascension crystal not found",
  ASCENSION_CRYSTAL_NOT_PLACED = "Ascension crystal not placed",
}

export type RemoveAscensionCrystalAction = {
  type: "ascensionCrystal.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveAscensionCrystalAction;
  createdAt?: number;
};

export function removeAscensionCrystal({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { ascensionCrystals } = stateCopy;
    const ascensionCrystal = ascensionCrystals[action.id];
    if (!ascensionCrystal) {
      throw new Error(
        REMOVE_ASCENSION_CRYSTAL_ERRORS.ASCENSION_CRYSTAL_NOT_FOUND,
      );
    }

    if (ascensionCrystal.x === undefined || ascensionCrystal.y === undefined) {
      throw new Error(
        REMOVE_ASCENSION_CRYSTAL_ERRORS.ASCENSION_CRYSTAL_NOT_PLACED,
      );
    }

    delete ascensionCrystal.x;
    delete ascensionCrystal.y;
    ascensionCrystal.removedAt = createdAt;

    return stateCopy;
  });
}
