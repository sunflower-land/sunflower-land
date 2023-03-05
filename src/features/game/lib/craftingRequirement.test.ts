import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "../types/game";
import { INITIAL_BUMPKIN, TEST_FARM } from "./constants";
import { craftingRequirementsMet } from "./craftingRequirement";
import { BumpkinLevel, LEVEL_EXPERIENCE } from "./level";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {},
  collectibles: {},
};

const inventoryThatMetRequirement: Partial<Record<InventoryItemName, Decimal>> =
  {
    Kuebiko: new Decimal(0),
    "Gold Egg": new Decimal(1),
    Gold: new Decimal(10),
  };

const craftingRequirement = {
  resources: [
    { item: "Kuebiko" as InventoryItemName, amount: new Decimal(0) },
    { item: "Gold Egg" as InventoryItemName, amount: new Decimal(1) },
    { item: "Gold" as InventoryItemName, amount: new Decimal(10) },
  ],
  sfl: new Decimal(100),
  level: 30,
};

describe("craftingRequirementsMet", () => {
  it("returns false if SFL requirement not met", () => {
    const gameState = {
      ...GAME_STATE,
      balance: craftingRequirement.sfl.minus(1),
      inventory: inventoryThatMetRequirement,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[craftingRequirement.level as BumpkinLevel],
      },
    };
    expect(craftingRequirementsMet(gameState, craftingRequirement)).toBeFalsy();
  });
  it("returns false if level requirement not met", () => {
    const gameState = {
      ...GAME_STATE,
      balance: craftingRequirement.sfl,
      inventory: inventoryThatMetRequirement,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience:
          LEVEL_EXPERIENCE[(craftingRequirement.level - 1) as BumpkinLevel],
      },
    };
    expect(craftingRequirementsMet(gameState, craftingRequirement)).toBeFalsy();
  });
  it("returns false if resources requirement not met", () => {
    const gameState = {
      ...GAME_STATE,
      balance: craftingRequirement.sfl,
      inventory: {
        ...inventoryThatMetRequirement,
        Gold: new Decimal(1),
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[craftingRequirement.level as BumpkinLevel],
      },
    };
    expect(craftingRequirementsMet(gameState, craftingRequirement)).toBeFalsy();
  });
  it("returns true if resources, SFL and level requirements are all met", () => {
    const gameState = {
      ...GAME_STATE,
      balance: craftingRequirement.sfl,
      inventory: inventoryThatMetRequirement,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[craftingRequirement.level as BumpkinLevel],
      },
    };
    expect(
      craftingRequirementsMet(gameState, craftingRequirement)
    ).toBeTruthy();
  });
});
