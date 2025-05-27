import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../lib/constants";
import { claimBlessing } from "./claimBlessing";

describe("claimBlessing", () => {
  it("requires a reward exists", () => {
    expect(() =>
      claimBlessing({
        action: {
          type: "blessing.claimed",
        },
        createdAt: Date.now(),
        state: INITIAL_FARM,
      }),
    ).toThrow("No reward exists");
  });
  it("adds coins", () => {
    const state = claimBlessing({
      action: {
        type: "blessing.claimed",
      },
      createdAt: Date.now(),
      state: {
        ...INITIAL_FARM,
        blessing: {
          offering: { item: "Potato" },
          reward: {
            coins: 100,
            items: {},
            createdAt: Date.now(),
          },
        },
      },
    });

    expect(state.coins).toEqual(100);
  });
  it("adds items", () => {
    const state = claimBlessing({
      action: {
        type: "blessing.claimed",
      },
      createdAt: Date.now(),
      state: {
        ...INITIAL_FARM,
        blessing: {
          offering: { item: "Potato" },
          reward: {
            coins: 100,
            items: {
              "Bronze Flower Box": 1,
            },
            createdAt: Date.now(),
          },
        },
      },
    });

    expect(state.inventory["Bronze Flower Box"]).toEqual(new Decimal(1));
  });
  it("removes the reward", () => {
    const state = claimBlessing({
      action: {
        type: "blessing.claimed",
      },
      createdAt: Date.now(),
      state: {
        ...INITIAL_FARM,
        blessing: {
          offering: { item: "Potato" },
          reward: {
            coins: 100,
            items: {
              "Bronze Flower Box": 1,
            },
            createdAt: Date.now(),
          },
        },
      },
    });

    expect(state.blessing.reward).toBeUndefined();
  });
});
