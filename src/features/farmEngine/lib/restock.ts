import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import { INITIAL_STOCK, type StockableName } from "features/game/lib/constants";
import {
  canRestockShipment,
  SHIPMENT_STOCK,
} from "features/game/events/landExpansion/shipmentRestocked";
import { SEEDS } from "features/game/types/seeds";
import { TREASURE_TOOLS, WORKBENCH_TOOLS } from "features/game/types/tools";

/**
 * RestockBoat.tsx's shipment maths, extracted so the Phaser BoatsLayer
 * (visibility) and the React restock modal (contents) share one source.
 */

export const getShipmentAmount = (
  state: GameState,
  item: StockableName,
  amount: number,
): Decimal => {
  const totalStock = INITIAL_STOCK(state)[item];
  const remainingStock = state.stock[item] ?? new Decimal(0);
  if (remainingStock.add(amount).gt(totalStock)) {
    return totalStock.sub(remainingStock);
  }
  return new Decimal(amount);
};

export const getRestockLists = (state: GameState) => {
  const tools = Object.entries(SHIPMENT_STOCK)
    .filter(([item]) => item in { ...WORKBENCH_TOOLS, ...TREASURE_TOOLS })
    .filter(([item, amount]) =>
      getShipmentAmount(state, item as StockableName, amount).gt(0),
    );

  const seeds = Object.entries(SHIPMENT_STOCK)
    .filter(([item]) => item in SEEDS)
    .filter(([item, amount]) =>
      getShipmentAmount(state, item as StockableName, amount).gt(0),
    );

  return { tools, seeds };
};

/** RestockBoat.tsx's visibility: restock available, shipped before, non-empty. */
export const isRestockBoatVisible = (state: GameState): boolean => {
  if (!canRestockShipment({ game: state })) return false;
  if (!state.shipments.restockedAt) return false;
  const { tools, seeds } = getRestockLists(state);
  return tools.length + seeds.length > 0;
};
