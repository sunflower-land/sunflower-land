import { KNOWN_IDS } from ".";
import { GoblinState } from "../lib/goblinMachine";
import { CROPS } from "./crops";
import { InventoryItemName } from "./game";

type WithdrawCondition = boolean | ((gameState: GoblinState) => boolean);

// Helps build withdraw rules for item groups
function buildDefaults(
  itemNames: string[],
  withdrawCondition: WithdrawCondition
): Partial<Record<InventoryItemName, WithdrawCondition>> {
  return itemNames.reduce(
    (prev, cur) => ({
      ...prev,
      [cur]: withdrawCondition,
    }),
    {}
  );
}

// Everything is non-withdawable by default
const globalDefaults = Object.keys(KNOWN_IDS).reduce(
  (prev, cur) => ({
    ...prev,
    [cur]: false,
  }),
  {}
) as Record<InventoryItemName, WithdrawCondition>;

// Group withdraw conditions for common items
const cropDefaults = buildDefaults(Object.keys(CROPS()), true);

export const WITHDRAWABLES: Record<InventoryItemName, WithdrawCondition> = {
  ...globalDefaults,
  ...cropDefaults,
};
