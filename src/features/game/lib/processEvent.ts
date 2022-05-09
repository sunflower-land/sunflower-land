import Decimal from "decimal.js-light";
import { EVENTS, GameEvent } from "../events";
import { FOODS } from "../types/craftables";
import { GameState, Inventory, InventoryItemName } from "../types/game";
import { SKILL_TREE } from "../types/skills";

const maxItems: Inventory = {
  // Stock limits
  "Sunflower Seed": new Decimal("400"),
  "Potato Seed": new Decimal("200"),
  "Pumpkin Seed": new Decimal("100"),
  "Carrot Seed": new Decimal("100"),
  "Cabbage Seed": new Decimal("90"),
  "Beetroot Seed": new Decimal("80"),
  "Cauliflower Seed": new Decimal("70"),
  "Parsnip Seed": new Decimal("40"),
  "Radish Seed": new Decimal("40"),
  "Wheat Seed": new Decimal("40"),

  // Seed limits + buffer of 10
  Sunflower: new Decimal("410"),
  Potato: new Decimal("210"),
  Pumpkin: new Decimal("110"),
  Carrot: new Decimal("110"),
  Cabbage: new Decimal("100"),
  Beetroot: new Decimal("90"),
  Cauliflower: new Decimal("90"),
  Parsnip: new Decimal("50"),
  Radish: new Decimal("50"),
  Wheat: new Decimal("50"),

  // Stock limits
  Axe: new Decimal("50"),
  Pickaxe: new Decimal("30"),
  "Stone Pickaxe": new Decimal("10"),
  "Iron Pickaxe": new Decimal("5"),

  Gold: new Decimal("20"),
  Iron: new Decimal("50"),
  Stone: new Decimal("100"),
  Wood: new Decimal("200"),

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

function isValidProgress({ state, onChain }: ProcessEventArgs) {
  const progress = state.balance.sub(onChain.balance);

  /**
   * Contract enforced SFL caps
   * Just in case a player gets in a corrupt state and manages to earn extra SFL
   */
  if (progress.gt(100)) {
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
    alert("Please sync to the blockchain.");
    throw new Error("Please sync to the blockchain");
  }

  return newState;
}
