import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";

const VALID_BEARS: InventoryItemName[] = [
  "Farmer Bear",
  "Classy Bear",
  "Badass Bear",
  "Turtle Bear",
  "Whale Bear",
  "Chef Bear",
  "Construction Bear",
  "Rich Bear",
  "Brilliant Bear",
  "Snorkel Bear",
  "Cyborg Bear",
  "Eggplant Bear",
  "Easter Bear",
  "Lifeguard Bear",
  "Pirate Bear",
  "Sunflower Bear",
  "Christmas Bear",
  "Bear Trap",
  "Valentine Bear",
  "Beta Bear",
  // "Collectible Bear",
  // "Genie Bear",
  // "Angel Bear",
  "Abandoned Bear",
  "Basic Bear",
  "Goblin Bear",
  "Human Bear",
  // "Rainbow Bear",
];

const HALLOWEEN_BEAR: InventoryItemName = "King of Bears";

export type SacrificeBearAction = {
  type: "bear.sacrificed";
  bears: InventoryItemName[];
};

type Options = {
  state: Readonly<GameState>;
  action: SacrificeBearAction;
};

export function sacrificeBear({ state, action }: Options) {
  return produce(state, (game) => {
    const { bears } = action;
    const { bumpkin, inventory } = game;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    // Validate 10 bears are provided
    if (bears.length !== 10) {
      throw new Error("Must sacrifice exactly 10 bears");
    }

    // Check for duplicates
    const uniqueBears = new Set(bears);
    if (uniqueBears.size !== bears.length) {
      throw new Error("All bears must be unique");
    }

    // Validate ownership and burn bears
    bears.forEach((bear) => {
      // Implement bear ownership validation logic here
      if (!VALID_BEARS.includes(bear)) {
        throw new Error(`Invalid bear: ${bear}`);
      }

      if (!inventory[bear]?.gte(1)) {
        throw new Error(`You do not have any ${bear} bears`);
      }

      inventory[bear] = (inventory[bear] ?? new Decimal(0)).sub(1);
    });

    inventory[HALLOWEEN_BEAR] = (
      inventory[HALLOWEEN_BEAR] ?? new Decimal(0)
    ).add(1);
  });
}
