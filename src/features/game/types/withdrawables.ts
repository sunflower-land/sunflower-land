import { KNOWN_IDS } from ".";
import { GoblinState } from "../lib/goblinMachine";
import { InventoryItemName } from "./game";

type WithdrawCondition = boolean | ((gameState: GoblinState) => boolean);

const withdrawDefaults = Object.keys(KNOWN_IDS).reduce(
  (prev, cur) => ({
    ...prev,
    [cur]: false,
  }),
  {}
) as Record<InventoryItemName, WithdrawCondition>;

export const WITHDRAWABLES: Record<InventoryItemName, WithdrawCondition> = {
  ...withdrawDefaults,
};
