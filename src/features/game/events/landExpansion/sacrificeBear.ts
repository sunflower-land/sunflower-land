import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";

const VALID_BEARS: InventoryItemName[] = [
  "Basic Bear",
  "Chef Bear",
  "Construction Bear",
  "Angel Bear",
  "Badass Bear",
  "Brilliant Bear",
  "Classy Bear",
  "Farmer Bear",
  "Sunflower Bear",
  "Rich Bear",
  "Christmas Bear",
  "Rainbow Artist Bear",
  "Devil Bear",
  "Collectible Bear",
  "Cyborg Bear",
  "Abandoned Bear",
  "Turtle Bear",
  "Lifeguard Bear",
  "Snorkel Bear",
  "Golden Bear Head",
  "Pirate Bear",
  "Goblin Bear",
  "Easter Bear",
  "Human Bear",
  "Whale Bear",
  "Valentine Bear",
  "Genie Bear",
  "Beta Bear",
  "Eggplant Bear",
];

const HALLOWEEN_BEAR: InventoryItemName = "Basic Bear";

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

      inventory[bear] = inventory[bear].sub(1);
    });

    inventory[HALLOWEEN_BEAR] = (
      inventory[HALLOWEEN_BEAR] ?? new Decimal(0)
    ).add(1);
  });
}
