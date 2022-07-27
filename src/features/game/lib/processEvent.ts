import Decimal from "decimal.js-light";
import { EVENTS, GameEvent } from "../events";
import { FOODS } from "../types/craftables";
import { GameState, Inventory, InventoryItemName } from "../types/game";
import { SKILL_TREE } from "../types/skills";
import { INITIAL_STOCK } from "./constants";

const maxItems: Inventory = {
  // Seed limits + buffer of 10
  Sunflower: new Decimal("3000"),
  Potato: new Decimal("2000"),
  Pumpkin: new Decimal("1000"),
  Carrot: new Decimal("1000"),
  Cabbage: new Decimal("1000"),
  Beetroot: new Decimal("1000"),
  Cauliflower: new Decimal("1000"),
  Parsnip: new Decimal("500"),
  Radish: new Decimal("500"),
  Wheat: new Decimal("500"),

  Chicken: new Decimal("20"),
  Egg: new Decimal("60"),
  "Speed Chicken": new Decimal("5"),
  "Rich Chicken": new Decimal("5"),
  "Fat Chicken": new Decimal("5"),

  // Stock limits
  ...INITIAL_STOCK,

  Gold: new Decimal("90"),
  Iron: new Decimal("400"),
  Stone: new Decimal("500"),
  Wood: new Decimal("500"),

  // Max of 1 food item
  ...(Object.keys(FOODS()) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1),
    }),
    {}
  ),

  // Max of 1 skill badge
  ...(Object.keys(SKILL_TREE) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1),
    }),
    {}
  ),
};

/**
 * Humanly possible SFL in a single session
 */
const MAX_SESSION_SFL = 175;

function isValidProgress({ state, onChain }: ProcessEventArgs): {
  valid: boolean;
  maxedItem?: InventoryItemName | "SFL";
} {
  const progress = state.balance.sub(onChain.balance);

  /**
   * Contract enforced SFL caps
   * Just in case a player gets in a corrupt state and manages to earn extra SFL
   */
  if (progress.gt(MAX_SESSION_SFL)) {
    return { valid: false, maxedItem: "SFL" };
  }

  let maxedItem: InventoryItemName | undefined = undefined;

  // Check inventory amounts
  const validProgress = (
    Object.keys(state.inventory) as InventoryItemName[]
  ).every((name) => {
    const onChainAmount = onChain.inventory[name] || new Decimal(0);

    const diff = state.inventory[name]?.minus(onChainAmount) || new Decimal(0);
    const max = maxItems[name] || new Decimal(0);

    if (max.eq(0)) {
      return true;
    }

    if (diff.gt(max)) {
      console.log({ name });

      maxedItem = name;

      return false;
    }

    return true;
  });

  return { valid: validProgress, maxedItem };
}

type ProcessEventArgs = {
  state: GameState;
  action: GameEvent;
  onChain: GameState;
};
export function processEvent({
  state,
  action,
  onChain,
}: ProcessEventArgs): GameState {
  const handler = EVENTS[action.type];

  if (!handler) {
    throw new Error(`Unknown event type: ${action}`);
  }

  const newState = handler({
    state,
    // TODO - fix type error
    action: action as never,
  });

  /**
   * Contract enforced SFL caps
   * Just in case a player gets in a corrupt state and manages to earn extra SFL
   */
  const { valid, maxedItem } = isValidProgress({
    state: newState,
    onChain,
    action,
  });

  if (!valid && maxedItem) {
    const maxAmount =
      maxedItem === "SFL" ? MAX_SESSION_SFL : maxItems[maxedItem]?.toNumber();

    alert(
      `You can only earn ${maxAmount} ${maxedItem} in a single session for security reasons. Please sync to the blockchain.`
    );

    throw new Error("Please sync to the blockchain");
  }

  return newState;
}
