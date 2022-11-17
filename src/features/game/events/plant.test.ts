import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import { GameState } from "../types/game";
import { getCropTime, getMultiplier, plant } from "./plant";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  fields: {},
  balance: new Decimal(0),
  inventory: {},
  trees: {},
};

describe("plant", () => {
  it("does not plant on non-existent field", () => {
    expect(() =>
      plant({
        state: GAME_STATE,
        action: {
          type: "item.planted",
          index: -1,
          item: "Sunflower Seed",
        },
      })
    ).toThrow("Field does not exist");
  });

  it("does not plant on non-integer field", () => {
    expect(() =>
      plant({
        state: GAME_STATE,
        action: {
          type: "item.planted",
          index: 1.2,
          item: "Sunflower Seed",
        },
      })
    ).toThrow("Field does not exist");
  });

  it("does not plant if first goblin is around", () => {
    expect(() =>
      plant({
        state: GAME_STATE,
        action: {
          type: "item.planted",
          index: 6,
          item: "Sunflower Seed",
        },
      })
    ).not.toThrow("Goblin land!");
  });

  it("plants if they have pumpkin soup", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Pumpkin Soup": new Decimal(1),
          "Potato Seed": new Decimal(2),
        },
      },
      action: {
        type: "item.planted",
        index: 6,
        item: "Potato Seed",
      },
    });

    expect(state.inventory["Potato Seed"]).toEqual(new Decimal(1));
    expect(state.fields[6]).toEqual({
      name: "Potato",
      plantedAt: expect.any(Number),
      multiplier: 1,
    });
  });

  it("does not plant if second goblin is around", () => {
    expect(() =>
      plant({
        state: GAME_STATE,
        action: {
          type: "item.planted",
          index: 11,
          item: "Sunflower Seed",
        },
      })
    ).not.toThrow("Goblin land!");
  });

  it("plants if they have Sauerkraut", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          Sauerkraut: new Decimal(1),
          "Pumpkin Seed": new Decimal(2),
        },
      },
      action: {
        type: "item.planted",
        index: 12,
        item: "Pumpkin Seed",
      },
    });

    expect(state.inventory["Pumpkin Seed"]).toEqual(new Decimal(1));
    expect(state.fields[12]).toEqual({
      name: "Pumpkin",
      plantedAt: expect.any(Number),
      multiplier: 1,
    });
  });

  it("does not plant if third goblin is around", () => {
    expect(() =>
      plant({
        state: GAME_STATE,
        action: {
          type: "item.planted",
          index: 11,
          item: "Sunflower Seed",
        },
      })
    ).not.toThrow("Goblin land!");
  });

  it("plants if they have cauliflower rice", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Roasted Cauliflower": new Decimal(1),
          "Pumpkin Seed": new Decimal(2),
        },
      },
      action: {
        type: "item.planted",
        index: 20,
        item: "Pumpkin Seed",
      },
    });

    expect(state.inventory["Pumpkin Seed"]).toEqual(new Decimal(1));
    expect(state.fields[20]).toEqual({
      name: "Pumpkin",
      plantedAt: expect.any(Number),
      multiplier: 1,
    });
  });

  it("does not plant on non-existent field", () => {
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          inventory: {
            "Roasted Cauliflower": new Decimal(1),
            "Pumpkin Seed": new Decimal(2),
          },
        },
        action: {
          type: "item.planted",
          index: 22,
          item: "Pumpkin Seed",
        },
      })
    ).toThrow("Field does not exist");
  });

  it("does not plant if crop already exists", () => {
    expect(() =>
      plant({
        state: {
          ...GAME_STATE,
          fields: {
            0: {
              name: "Sunflower",
              plantedAt: Date.now(),
            },
          },
        },
        action: {
          type: "item.planted",
          index: 0,
          item: "Sunflower Seed",
        },
      })
    ).toThrow("Crop is already planted");
  });

  it("does not plant an invalid item", () => {
    expect(() =>
      plant({
        state: GAME_STATE,
        action: {
          type: "item.planted",
          index: 0,
          item: "Pickaxe",
        },
      })
    ).toThrow("Not a seed");
  });

  it("does not plant if user does not have seeds", () => {
    expect(() =>
      plant({
        state: GAME_STATE,
        action: {
          type: "item.planted",
          index: 0,
          item: "Sunflower Seed",
        },
      })
    ).toThrow("Not enough seeds");
  });

  it("plants a seed", () => {
    const state = plant({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(5),
        },
      },
      action: {
        type: "item.planted",
        index: 0,
        item: "Sunflower Seed",
      },
    });

    expect(state).toEqual({
      ...GAME_STATE,
      inventory: {
        "Sunflower Seed": new Decimal(4),
      },
      fields: {
        0: {
          name: "Sunflower",
          plantedAt: expect.any(Number),
          multiplier: 1,
        },
      },
    });
  });

  describe("getCropTime", () => {
    it("plants a normal carrot", () => {
      const time = getCropTime("Carrot", {});

      expect(time).toEqual(60 * 60);
    });

    it("plants a normal carrot with the carrot amulet boost", () => {
      const time = getCropTime("Carrot", {
        "Carrot Amulet": new Decimal(1),
      });

      expect(time).toEqual(48 * 60);
    });
  });

  describe("getMultiplier", () => {
    it("plants a normal sunflower", () => {
      const amount = getMultiplier({
        crop: "Sunflower",
        inventory: {},
      });

      expect(amount).toEqual(1);
    });
    it("plants a sunflower with the sunflower amulet boost", () => {
      const amount = getMultiplier({
        crop: "Sunflower",
        inventory: {
          "Sunflower Amulet": new Decimal(1),
        },
      });

      expect(amount).toEqual(1.1);
    });
    it("plants a normal beetroot", () => {
      const amount = getMultiplier({
        crop: "Beetroot",
        inventory: {},
      });

      expect(amount).toEqual(1);
    });
    it("plants a beetroot with the beetroot amulet boost", () => {
      const amount = getMultiplier({
        crop: "Beetroot",
        inventory: {
          "Beetroot Amulet": new Decimal(1),
        },
      });

      expect(amount).toEqual(1.2);
    });
    it("plants a normal pumpkin", () => {
      const amount = getMultiplier({
        crop: "Pumpkin",
        inventory: {},
      });

      expect(amount).toEqual(1);
    });
    it("plants a pumpkin with the victoria sisters boost", () => {
      const amount = getMultiplier({
        crop: "Pumpkin",
        inventory: {
          "Victoria Sisters": new Decimal(1),
        },
      });

      expect(amount).toEqual(1.2);
    });
  });
});
