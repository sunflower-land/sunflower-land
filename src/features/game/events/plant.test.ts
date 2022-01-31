import Decimal from "decimal.js-light";
import { GameState } from "../types/game";
import { plant } from "./plant";

let GAME_STATE: GameState = {
  id: 1,
  fields: {},
  balance: new Decimal(0),
  inventory: {},
};

describe("plant", () => {
  it("does not plant on non-existent field", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: -1,
        item: "Sunflower Seed",
      })
    ).toThrow("Field does not exist");
  });

  it("does not plant on non-integer field", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: 1.2,
        item: "Sunflower Seed",
      })
    ).toThrow("Field does not exist");
  });

  it("does not plant if first goblin is around", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: 6,
        item: "Sunflower Seed",
      })
    ).toThrow("Goblin land!");
  });

  it("plants if they have pumpkin soup", () => {
    const state = plant(
      {
        ...GAME_STATE,
        inventory: {
          "Pumpkin Soup": 1,
          "Potato Seed": 2,
        },
      },
      {
        type: "item.planted",
        index: 6,
        item: "Potato Seed",
      }
    );

    expect(state.inventory["Potato Seed"]).toEqual(1);
    expect(state.fields[6]).toEqual({
      name: "Potato",
      plantedAt: expect.any(Number),
    });
  });

  it("does not plant if second goblin is around", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: 11,
        item: "Sunflower Seed",
      })
    ).toThrow("Goblin land!");
  });

  it("plants if they have Sauerkraut", () => {
    const state = plant(
      {
        ...GAME_STATE,
        inventory: {
          Sauerkraut: 1,
          "Pumpkin Seed": 2,
        },
      },
      {
        type: "item.planted",
        index: 12,
        item: "Pumpkin Seed",
      }
    );

    expect(state.inventory["Pumpkin Seed"]).toEqual(1);
    expect(state.fields[12]).toEqual({
      name: "Pumpkin",
      plantedAt: expect.any(Number),
    });
  });

  it("does not plant if third goblin is around", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: 11,
        item: "Sunflower Seed",
      })
    ).toThrow("Goblin land!");
  });

  it("plants if they have cauliflower rice", () => {
    const state = plant(
      {
        ...GAME_STATE,
        inventory: {
          "Roasted Cauliflower": 1,
          "Pumpkin Seed": 2,
        },
      },
      {
        type: "item.planted",
        index: 20,
        item: "Pumpkin Seed",
      }
    );

    expect(state.inventory["Pumpkin Seed"]).toEqual(1);
    expect(state.fields[20]).toEqual({
      name: "Pumpkin",
      plantedAt: expect.any(Number),
    });
  });

  it("does not plant on non-existent field", () => {
    expect(() =>
      plant(
        {
          ...GAME_STATE,
          inventory: {
            "Roasted Cauliflower": 1,
            "Pumpkin Seed": 2,
          },
        },
        {
          type: "item.planted",
          index: 22,
          item: "Pumpkin Seed",
        }
      )
    ).toThrow("Field does not exist");
  });

  it("does not plant if crop already exists", () => {
    expect(() =>
      plant(
        {
          ...GAME_STATE,
          fields: {
            0: {
              name: "Sunflower",
              plantedAt: Date.now(),
            },
          },
        },
        {
          type: "item.planted",
          index: 0,
          item: "Sunflower Seed",
        }
      )
    ).toThrow("Crop is already planted");
  });

  it("does not plant an invalid item", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: 0,
        item: "Pickaxe",
      })
    ).toThrow("Not a seed");
  });

  it("does not plant if user does not have seeds", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: 0,
        item: "Sunflower Seed",
      })
    ).toThrow("Not enough seeds");
  });

  it("plants a seed", () => {
    const state = plant(
      {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": 5,
        },
      },
      {
        type: "item.planted",
        index: 0,
        item: "Sunflower Seed",
      }
    );

    expect(state).toEqual({
      ...GAME_STATE,
      inventory: {
        "Sunflower Seed": 4,
      },
      fields: {
        0: {
          name: "Sunflower",
          plantedAt: expect.any(Number),
        },
      },
    });
  });
});
