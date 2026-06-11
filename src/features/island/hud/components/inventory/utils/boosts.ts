import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import type { GameState, InventoryItemName } from "features/game/types/game";

export const hasBoost = (name: InventoryItemName, state: GameState) =>
  name in COLLECTIBLE_BUFF_LABELS &&
  (COLLECTIBLE_BUFF_LABELS[name]?.(state) ?? []).length > 0;
