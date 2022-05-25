import Decimal from "decimal.js-light";
import { EVENTS, GameEvent } from "../events";
import { FOODS } from "../types/craftables";
import { GameState, Inventory, InventoryItemName } from "../types/game";
import { SKILL_TREE } from "../types/skills";

const maxItems: Inventory = {
  // Stock limits
  "Sunflower Seed": new Decimal("500"),
  "Potato Seed": new Decimal("300"),
  "Pumpkin Seed": new Decimal("200"),
  "Carrot Seed": new Decimal("200"),
  "Cabbage Seed": new Decimal("200"),
  "Beetroot Seed": new Decimal("200"),
  "Cauliflower Seed": new Decimal("200"),
  "Parsnip Seed": new Decimal("100"),
  "Radish Seed": new Decimal("100"),
  "Wheat Seed": new Decimal("100"),

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

  // Stock limits
  Axe: new Decimal("100"),
  Pickaxe: new Decimal("50"),
  "Stone Pickaxe": new Decimal("30"),
  "Iron Pickaxe": new Decimal("20"),

  Gold: new Decimal("100"),
  Iron: new Decimal("500"),
  Stone: new Decimal("600"),
  Wood: new Decimal("1000"),

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

function isValidProgress({ state, onChain }: ProcessEventArgs) {
  const progress = state.balance.sub(onChain.balance);

  /**
   * Contract enforced SFL caps
   * Just in case a player gets in a corrupt state and manages to earn extra SFL
   */
  if (progress.gt(MAX_SESSION_SFL)) {
    return false;
  }

  // Check inventory amounts
  const validProgress = (
    Object.keys(state.inventory) as InventoryItemName[]
  ).every((name) => {
    const onChainAmount = onChain.inventory[name] || new Decimal(0);

    const diff = state.inventory[name]?.minus(onChainAmount) || new Decimal(0);
    const max = maxItems[name] || new Decimal(0);

    if (diff.gt(max)) {
      console.log({
        name,
      });
      return false;
    }

    return true;
  });

  return validProgress;
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

  console.log({ onChain });
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
  if (!isValidProgress({ state: newState, onChain, action })) {
    alert(
      "You can only earn 100 SFL in a single session for security reasons. Please sync to the blockchain."
    );
    throw new Error("Please sync to the blockchain");
  }

  return newState;
}
