import Decimal from "decimal.js-light";
import { EVENTS, GameEvent } from "../events";
import { FOODS, getKeys } from "../types/craftables";
import { GameState, Inventory, InventoryItemName } from "../types/game";
import { SKILL_TREE } from "../types/skills";

const maxItems: Inventory = {
  // Seed limits + buffer of 20
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
  Apple: new Decimal("100"),
  Orange: new Decimal("100"),
  Blueberry: new Decimal("100"),

  Chicken: new Decimal("20"),
  Egg: new Decimal("100"),
  "Speed Chicken": new Decimal("5"),
  "Rich Chicken": new Decimal("5"),
  "Fat Chicken": new Decimal("5"),

  "Sunflower Seed": new Decimal(420),
  "Potato Seed": new Decimal(220),
  "Pumpkin Seed": new Decimal(120),
  "Carrot Seed": new Decimal(120),
  "Cabbage Seed": new Decimal(110),
  "Beetroot Seed": new Decimal(100),
  "Cauliflower Seed": new Decimal(100),
  "Parsnip Seed": new Decimal(80),
  "Radish Seed": new Decimal(60),
  "Wheat Seed": new Decimal(60),
  "Apple Seed": new Decimal(50),
  "Blueberry Seed": new Decimal(50),
  "Orange Seed": new Decimal(50),

  Gold: new Decimal("90"),
  Iron: new Decimal("400"),
  Stone: new Decimal("500"),
  Wood: new Decimal("500"),

  "War Bond": new Decimal(500),
  "Human War Banner": new Decimal(1),
  "Goblin War Banner": new Decimal(1),
  "Chef Hat": new Decimal(1),
  "Rapid Growth": new Decimal(100),
  "Red Envelope": new Decimal(100),

  // Max of 1000 food item
  ...(Object.keys(FOODS()) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1000),
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
const MAX_SESSION_SFL = 255;

export function checkProgress({
  state,
  onChain,
}: {
  state: GameState;
  onChain: GameState;
}): {
  valid: boolean;
  maxedItem?: InventoryItemName | "SFL";
} {
  console.log({ state, onChain });
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
  const validProgress = getKeys(state.inventory).every((name) => {
    const onChainAmount = onChain.inventory[name] || new Decimal(0);

    const diff = state.inventory[name]?.minus(onChainAmount) || new Decimal(0);

    const max = maxItems[name] || new Decimal(0);

    if (max.eq(0)) return true;

    if (diff.gt(max)) {
      maxedItem = name;

      return false;
    }

    return true;
  });

  console.log({ validProgress });

  return { valid: validProgress, maxedItem };
}

type ProcessEventArgs = {
  state: GameState;
  action: GameEvent;
};

export function processEvent({ state, action }: ProcessEventArgs): GameState {
  const handler = EVENTS[action.type];

  if (!handler) {
    throw new Error(`Unknown event type: ${action}`);
  }

  const newState = handler({
    state,
    // TODO - fix type error
    action: action as never,
  });

  return newState;
}
