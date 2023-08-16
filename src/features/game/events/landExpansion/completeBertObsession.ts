import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import { GameState, InventoryItemName } from "features/game/types/game";
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
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!stateCopy.npcs) {
    throw new Error("NPCs does not exist");
  }

  if (!stateCopy.npcs?.bert) {
    stateCopy.npcs.bert = { deliveryCount: 0 };
  }

  const currentObsession = stateCopy.bertObsession;
  if (!currentObsession) {
    throw new Error("No discovery available");
  }

  if (stateCopy.npcs.bert.questCompletedAt) {
    const obsessionAlreadyCompleted =
      stateCopy.npcs.bert.questCompletedAt >= currentObsession.startDate &&
      stateCopy.npcs.bert.questCompletedAt <= currentObsession.endDate;

    if (obsessionAlreadyCompleted) {
      throw new Error("This obsession is already completed");
    }
  }

  if (currentObsession.type === "collectible") {
    const isItemInInventory =
      stateCopy.inventory[currentObsession.name as InventoryItemName];

    if (!isItemInInventory) {
      throw new Error("You do not have the collectible required");
    }
  }

  if (currentObsession.type === "wearable") {
    const isWearableInWardrobe =
      stateCopy.wardrobe[currentObsession.name as BumpkinItem];

    if (!isWearableInWardrobe) {
      throw new Error("You do not have the wearable required");
    }
  }

  const currentFeathers = stateCopy.inventory["Crow Feather"] || new Decimal(0);
  stateCopy.inventory["Crow Feather"] = currentFeathers.add(3);

  stateCopy.npcs.bert.questCompletedAt = createdAt;

  return stateCopy;
}
