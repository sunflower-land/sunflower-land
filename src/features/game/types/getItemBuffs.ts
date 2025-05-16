import { BuffLabel } from ".";
import { getBudBuffs } from "./budBuffs";
import { BudName } from "./buds";
import { BumpkinItem } from "./bumpkin";
import { BUMPKIN_ITEM_BUFF_LABELS } from "./bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "./collectibleItemBuffs";
import { GameState, InventoryItemName } from "./game";
import { CollectionName, MarketplaceTradeableName } from "./marketplace";

export function getItemBuffs({
  state,
  item,
  collection,
}: {
  state: GameState;
  item: MarketplaceTradeableName;
  collection: CollectionName;
}): BuffLabel[] {
  if (collection === "buds") {
    const id = Number((item as BudName).split("#")[1]);

    return getBudBuffs(id);
  }

  if (collection === "wearables") {
    const buff = BUMPKIN_ITEM_BUFF_LABELS[item as BumpkinItem];

    return buff ? buff : [];
  }

  if (collection === "collectibles") {
    const buff = COLLECTIBLE_BUFF_LABELS(state)[item as InventoryItemName];

    return buff ? buff : [];
  }

  return [];
}
