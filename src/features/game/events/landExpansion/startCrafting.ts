import { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";

export type StartCraftingAction = {
  type: "crafting.started";
  ingredients: (InventoryItemName | null)[];
};

type Options = {
  state: Readonly<GameState>;
  action: StartCraftingAction;
  createdAt?: number;
};

export function startCrafting({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { ingredients } = action;

    if (ingredients.length !== 9) {
      throw new Error("You must provide 9 ingredients");
    }

    // Check if player has the Crafting Box
    const isBuildingBuilt = (copy.buildings["Crafting Box"]?.length ?? 0) > 0;
    if (!isBuildingBuilt) {
      throw new Error("You do not have a Crafting Box");
    }

    // Check if there's an ongoing crafting
    if (copy.craftingBox.status === "pending") {
      throw new Error("There's already an ongoing crafting");
    }

    // Set crafting status to pending
    copy.craftingBox = {
      status: "pending",
      startedAt: createdAt,
      readyAt: createdAt,
    };
  });
}
