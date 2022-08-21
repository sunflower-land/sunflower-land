import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../lib/constants";
import { pruneCrop } from "./pruneCrop";

describe("pruneCrop", () => {
  it("does not prune a non existent field", () => {
    expect(() =>
      pruneCrop({
        state: {
          ...INITIAL_FARM,
          fields: {},
        },
        action: {
          fieldIndex: 3,
          type: "item.pruned",
        },
      })
    ).toThrow("Cannot prune an empty field");
  });

  it("does not prune a non magic crop", () => {
    expect(() =>
      pruneCrop({
        state: {
          ...INITIAL_FARM,
          fields: {
            3: {
              name: "Sunflower",
              plantedAt: 0,
            },
          },
        },
        action: {
          fieldIndex: 3,
          type: "item.pruned",
        },
      })
    ).toThrow("Cannot prune a normal crop");
  });

  it("only prunes when ready", () => {
    expect(() =>
      pruneCrop({
        state: {
          ...INITIAL_FARM,
          fields: {
            3: {
              name: "Magic Seed",
              plantedAt: Date.now() - 5000,
            },
          },
        },
        action: {
          fieldIndex: 3,
          type: "item.pruned",
        },
      })
    ).toThrow("Crop is not ready to prune");
  });

  it("only prunes a second time when ready", () => {
    expect(() =>
      pruneCrop({
        state: {
          ...INITIAL_FARM,
          fields: {
            3: {
              name: "Magic Seed",
              // 36 hours ago
              plantedAt: Date.now() - 36 * 60 * 60 * 1000,
              // 6 hours ago
              prunedAt: [Date.now() - 6 * 60 * 60 * 1000],
            },
          },
        },
        action: {
          fieldIndex: 3,
          type: "item.pruned",
        },
      })
    ).toThrow("Crop is not ready to prune");
  });

  it("does not prune a dead plant", () => {
    expect(() =>
      pruneCrop({
        state: {
          ...INITIAL_FARM,
          fields: {
            3: {
              name: "Magic Seed",
              // 50 hours ago
              plantedAt: Date.now() - 50 * 60 * 60 * 1000,
            },
          },
        },
        action: {
          fieldIndex: 3,
          type: "item.pruned",
        },
      })
    ).toThrow("Crop is dead");
  });

  it("prunes a magic crop", () => {
    const now = Date.now();
    const plantedAt = Date.now() - 25 * 60 * 60 * 1000;
    const state = pruneCrop({
      state: {
        ...INITIAL_FARM,
        fields: {
          2: {
            name: "Sunflower",
            plantedAt: 0,
          },
          3: {
            name: "Magic Seed",
            // 25 hours ago
            plantedAt,
          },
        },
      },
      action: {
        fieldIndex: 3,
        type: "item.pruned",
      },
      createdAt: now,
    });

    expect(state.fields).toEqual({
      2: {
        name: "Sunflower",
        plantedAt: 0,
      },
      3: {
        name: "Magic Seed",
        plantedAt,
        prunedAt: [now],
      },
    });
  });

  it("receives a reward", () => {
    const now = Date.now();
    const plantedAt = Date.now() - 25 * 60 * 60 * 1000;
    const state = pruneCrop({
      state: {
        ...INITIAL_FARM,
        inventory: {
          Sunflower: new Decimal(1),
        },
        balance: new Decimal(0),
        fields: {
          2: {
            name: "Sunflower",
            plantedAt: 0,
          },
          3: {
            name: "Magic Seed",
            // 25 hours ago
            plantedAt,
            prunedAt: [
              Date.now() - 72 * 60 * 60 * 1000,
              Date.now() - 44 * 60 * 60 * 1000,
            ],
            reward: {
              items: [
                {
                  amount: 50,
                  name: "Rapid Growth",
                },
              ],
              sfl: 100,
            },
          },
        },
      },
      action: {
        fieldIndex: 3,
        type: "item.pruned",
      },
      createdAt: now,
    });

    expect(state.fields).toEqual({
      2: {
        name: "Sunflower",
        plantedAt: 0,
      },
    });

    expect(state.balance).toEqual(new Decimal(100));
    expect(state.inventory).toEqual({
      ...state.inventory,
      "Rapid Growth": new Decimal(50),
    });
  });
});
