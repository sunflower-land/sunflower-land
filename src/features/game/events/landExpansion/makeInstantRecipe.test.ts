import Decimal from "decimal.js-light";

import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { INSTANT_PROCESSED_RECIPES } from "features/game/types/consumables";
import {
  MakeInstantRecipeAction,
  makeInstantRecipe,
} from "./makeInstantRecipe";
import { ProcessingBuildingName } from "features/game/types/buildings";

const createdAt = Date.now();

const BASE_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  inventory: {
    "Fish Flake": new Decimal(2),
    Seaweed: new Decimal(2),
  },
  buildings: {
    ...TEST_FARM.buildings,
    "Fish Market": [
      {
        id: "123",
        coordinates: { x: 0, y: 0 },
        createdAt,
      },
    ],
  },
};

describe("makeInstantRecipe", () => {
  it("throws when the building is not a resource processing building", () => {
    expect(() =>
      makeInstantRecipe({
        state: BASE_STATE,
        action: {
          type: "instantRecipe.made",
          recipe: "Furikake Sprinkle",
          buildingId: "123",
          buildingName: "Fire Pit" as ProcessingBuildingName,
        },
        createdAt,
      }),
    ).toThrow("Invalid resource processing building");
  });

  it("throws when Fish Market is missing", () => {
    expect(() =>
      makeInstantRecipe({
        state: {
          ...BASE_STATE,
          buildings: {},
        },
        action: {
          type: "instantRecipe.made",
          recipe: "Furikake Sprinkle",
          buildingId: "missing",
          buildingName: "Fish Market",
        } as MakeInstantRecipeAction,
        createdAt,
      }),
    ).toThrow("Required building does not exist");
  });

  it("throws when ingredients are insufficient", () => {
    expect(() =>
      makeInstantRecipe({
        state: {
          ...BASE_STATE,
          inventory: {
            ...BASE_STATE.inventory,
            Seaweed: new Decimal(0),
          },
        },
        action: {
          type: "instantRecipe.made",
          recipe: "Furikake Sprinkle",
          buildingId: "123",
          buildingName: "Fish Market",
        } as MakeInstantRecipeAction,
        createdAt,
      }),
    ).toThrow("Insufficient ingredient: Seaweed");
  });

  it("deducts ingredients and awards the instant recipe", () => {
    const updated = makeInstantRecipe({
      state: BASE_STATE,
      action: {
        type: "instantRecipe.made",
        recipe: "Furikake Sprinkle",
        buildingId: "123",
        buildingName: "Fish Market",
      },
      createdAt,
    });

    const ingredients =
      INSTANT_PROCESSED_RECIPES["Furikake Sprinkle"].ingredients;

    expect(updated.inventory["Furikake Sprinkle"]).toEqual(new Decimal(1));
    expect(updated.inventory["Fish Flake"]).toEqual(
      BASE_STATE.inventory["Fish Flake"]?.sub(ingredients["Fish Flake"] ?? 0),
    );
    expect(updated.inventory.Seaweed).toEqual(
      BASE_STATE.inventory.Seaweed?.sub(ingredients.Seaweed ?? 0),
    );
    expect(updated.farmActivity["Furikake Sprinkle Made"]).toEqual(1);
  });
});
