import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getSeasonalTicket } from "features/game/types/seasons";
import cloneDeep from "lodash.clonedeep";
import { translate } from "lib/i18n/translate";

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
    throw new Error("You do not have a Bumpkin!");
  }

  if (!stateCopy.npcs) {
    throw new Error(translate("error.npcsNotExist"));
  }

  if (!stateCopy.npcs?.bert) {
    stateCopy.npcs.bert = { deliveryCount: 0 };
  }

  const currentObsession = stateCopy.bertObsession;
  if (!currentObsession) {
    throw new Error(translate("error.noDiscoveryAvailable"));
  }

  if (stateCopy.npcs.bert.questCompletedAt) {
    const obsessionAlreadyCompleted =
      stateCopy.npcs.bert.questCompletedAt >= currentObsession.startDate &&
      stateCopy.npcs.bert.questCompletedAt <= currentObsession.endDate;

    if (obsessionAlreadyCompleted) {
      throw new Error(translate("error.obsessionAlreadyCompleted"));
    }
  }

  if (currentObsession.type === "collectible") {
    const isItemInInventory =
      stateCopy.inventory[currentObsession.name as InventoryItemName];

    if (!isItemInInventory) {
      throw new Error(translate("error.collectibleNotInInventory"));
    }
  }

  if (currentObsession.type === "wearable") {
    const isWearableInWardrobe =
      stateCopy.wardrobe[currentObsession.name as BumpkinItem];

    if (!isWearableInWardrobe) {
      throw new Error(translate("error.wearableNotInWardrobe"));
    }
  }

  const currentTickets =
    stateCopy.inventory[getSeasonalTicket()] || new Decimal(0);
  stateCopy.inventory[getSeasonalTicket()] = currentTickets.add(
    currentObsession.reward
  );

  stateCopy.npcs.bert.questCompletedAt = createdAt;

  return stateCopy;
}
