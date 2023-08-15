import Decimal from "decimal.js-light";
import { GameState, NPCData } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type CompleteBertObsessionAction = {
  type: "bertObsession.completed";
};

type Options = {
  state: Readonly<GameState>;
  action: CompleteBertObsessionAction;
  createdAt?: number;
};

export function completeBertObsession({
  state,
  createdAt,
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const currentObsession = stateCopy.bertObsession;

  if (!currentObsession) {
    throw new Error("No discovery available");
  }

  if (currentObsession.collectibleName) {
    const isItemInInventory =
      stateCopy.inventory[currentObsession.collectibleName];

    if (!isItemInInventory) {
      throw new Error("You do not have the collectible required");
    }
  }

  if (currentObsession.wearableName) {
    const isWearableInWardrobe =
      stateCopy.wardrobe[currentObsession.wearableName];

    if (!isWearableInWardrobe) {
      throw new Error("You do not have the wearable required");
    }
  }

  if (stateCopy.npcs?.bert?.questCompletedAt) {
    const obsessionAlreadyCompleted =
      stateCopy.npcs?.bert?.questCompletedAt >= currentObsession.startDate &&
      stateCopy.npcs?.bert?.questCompletedAt <= currentObsession.endDate;

    if (obsessionAlreadyCompleted) {
      throw new Error("This obsession is already completed");
    }
  }

  const currentFeathers = stateCopy.inventory["Crow Feather"] || new Decimal(0);
  stateCopy.inventory["Crow Feather"] = currentFeathers.add(3);

  const updatedBert: NPCData = {
    questCompletedAt: createdAt,
    deliveryCount: stateCopy.npcs?.bert?.deliveryCount || 0,
  };

  const updatedNpcs = {
    ...stateCopy.npcs,
    bert: updatedBert,
  };

  return {
    ...stateCopy,
    npcs: updatedNpcs,
  };
}
