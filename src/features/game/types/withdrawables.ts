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

// Helper functions
type CanWithdrawArgs = {
  item: InventoryItemName;
  game: GoblinState;
};

function cropIsPlanted({ item, game }: CanWithdrawArgs): boolean {
  if (!game.fields) return false;

  const isPlanted = Object.values(game.fields).some(
    (field) => field.name === item
  );
  return isPlanted;
}

export const WITHDRAWABLES: Record<InventoryItemName, WithdrawCondition> = {
  ...globalDefaults,
  ...cropDefaults,
  "Easter Bunny": (game) => !cropIsPlanted({ item: "Carrot", game }),
  "Golden Cauliflower": (game) => !cropIsPlanted({ item: "Cauliflower", game }),
  "Mysterious Parsnip": (game) => !cropIsPlanted({ item: "Parsnip", game }),
};
