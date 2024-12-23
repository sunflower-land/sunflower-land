import Decimal from "decimal.js-light";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { KNOWN_IDS } from "features/game/types";
import { getKeys } from "features/game/types/decorations";
import { GameState, InventoryItemName } from "features/game/types/game";
import { MarketplaceTradeableName } from "features/game/types/marketplace";

const TRADE_POINTS_MULTIPLIER = 0.25; // Value adjustable

export function calculateTradePoints({
  points,
  sfl,
}: {
  points: number;
  sfl: number;
}) {
  const pointsCalculation = sfl * TRADE_POINTS_MULTIPLIER;
  const multipliedPoints = points * pointsCalculation;

  return { multipliedPoints };
}

export function addTradePoints({
  state,
  points,
  sfl,
  items,
}: {
  state: GameState;
  points: number;
  sfl: number;
  items?: Partial<Record<MarketplaceTradeableName, number>>;
}) {
  // Exclude resources
  if (items) {
    const name = getKeys(items).filter(
      (itemName) => itemName in KNOWN_IDS,
    )[0] as InventoryItemName;
    const isResource = getKeys(TRADE_LIMITS).includes(name);

    if (isResource) {
      return state;
    }
  }

  const { multipliedPoints } = calculateTradePoints({ points, sfl });

  // Add points to gamestate
  state.trades.tradePoints = (state.trades.tradePoints ?? 0) + multipliedPoints;
  state.inventory["Trade Point"] = (
    state.inventory["Trade Point"] ?? new Decimal(0)
  ).add(multipliedPoints);
  return state;
}
