import { TEST_FARM } from "features/game/lib/constants";
import { collectCandy } from "./collectCandy";
import Decimal from "decimal.js-light";
describe("collectCandy", () => {
  it("collects candy", () => {
    const now = Date.now();
    const state = collectCandy({
      state: TEST_FARM,
      action: {
        type: "candy.collected",
      },
      createdAt: now,
    });
    expect(state.christmas2024).toEqual({
      day: {
        1: {
          candy: 1,
          collectedAt: now,
        },
      },
    });
  });
  it("collects multiple candy", () => {
    let state = collectCandy({
      state: TEST_FARM,
      action: {
        type: "candy.collected",
      },
    });
    const now = Date.now();
    state = collectCandy({
      state,
      action: {
        type: "candy.collected",
      },
      createdAt: now,
    });
    expect(state.christmas2024).toEqual({
      day: {
        1: {
          candy: 2,
          collectedAt: now,
        },
      },
    });
  });
  it("does not collect more than the limit", () => {
    expect(() =>
      collectCandy({
        state: {
          ...TEST_FARM,
          christmas2024: {
            day: {
              1: {
                candy: 10,
                collectedAt: Date.now(),
              },
            },
          },
        },
        action: {
          type: "candy.collected",
        },
      }),
    ).toThrow("Reached daily limit");
  });
  it("collects candy the next day", () => {
    const firstDay = Date.now();
    let state = collectCandy({
      state: {
        ...TEST_FARM,
        christmas2024: {
          day: {
            1: {
              candy: 9,
              collectedAt: Date.now(),
            },
          },
        },
      },
      action: {
        type: "candy.collected",
      },
      createdAt: firstDay,
    });
    const secondDay = firstDay + 24 * 60 * 60 * 1000;
    state = collectCandy({
      state,
      action: {
        type: "candy.collected",
      },
      createdAt: secondDay,
    });
    expect(state.christmas2024).toEqual({
      day: {
        1: {
          candy: 10,
          collectedAt: firstDay,
        },
        2: {
          candy: 1,
          collectedAt: secondDay,
        },
      },
    });
  });
  it("claims the sfl reward", () => {
    const mockDate = Date.now();

    const state = collectCandy({
      state: {
        ...TEST_FARM,
        christmas2024: {
          day: {
            1: {
              candy: 10,
              collectedAt: mockDate - 1 * 24 * 60 * 60 * 1000,
            },
            2: {
              candy: 10,
              collectedAt: mockDate - 2 * 24 * 60 * 60 * 1000,
            },
            3: {
              candy: 10,
              collectedAt: mockDate - 3 * 24 * 60 * 60 * 1000,
            },
            4: {
              candy: 10,
              collectedAt: mockDate - 4 * 24 * 60 * 60 * 1000,
            },
            5: {
              candy: 10,
              collectedAt: mockDate - 3 * 24 * 60 * 60 * 1000,
            },
            6: {
              candy: 10,
              collectedAt: mockDate - 3 * 24 * 60 * 60 * 1000,
            },
            7: {
              candy: 10,
              collectedAt: mockDate - 4 * 24 * 60 * 60 * 1000,
            },
            8: {
              candy: 10,
              collectedAt: mockDate - 3 * 24 * 60 * 60 * 1000,
            },
            9: {
              candy: 10,
              collectedAt: mockDate - 2 * 24 * 60 * 60 * 1000,
            },
            10: {
              candy: 10,
              collectedAt: mockDate - 1 * 24 * 60 * 60 * 1000,
            },
            11: {
              candy: 9,
              collectedAt: mockDate,
            },
          },
        },
      },
      action: {
        type: "candy.collected",
      },
    });

    expect(state.balance).toEqual(new Decimal(5));
  });

  it("claims an item reward", () => {
    const state = collectCandy({
      state: {
        ...TEST_FARM,
        christmas2024: {
          day: {
            1: {
              candy: 10,
              collectedAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            2: {
              candy: 9,
              collectedAt: Date.now(),
            },
          },
        },
      },
      action: {
        type: "candy.collected",
      },
    });
    expect(state.inventory["Carrot Cake"]).toEqual(new Decimal(2));
  });
  it("claims a wearable reward", () => {
    const state = collectCandy({
      state: {
        ...TEST_FARM,
        wardrobe: {},
        christmas2024: {
          day: {
            1: {
              candy: 9,
              collectedAt: Date.now(),
            },
          },
        },
      },
      action: {
        type: "candy.collected",
      },
    });
    expect(state.wardrobe).toEqual({
      "Gingerbread Onesie": 1,
    });
  });
  it("finishes after 12 days", () => {
    expect(() =>
      collectCandy({
        state: {
          ...TEST_FARM,
          wardrobe: {},
          christmas2024: {
            day: new Array(12)
              .fill({
                candy: 10,
                collectedAt: Date.now() - 50 * 60 * 60 * 1000,
              })
              .reduce((acc, obj, index) => ({ ...acc, [index + 1]: obj }), {}),
          },
        },
        action: {
          type: "candy.collected",
        },
      }),
    ).toThrow("Event finished");
  });
});
