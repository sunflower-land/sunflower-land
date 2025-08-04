import Decimal from "decimal.js-light";
import { getBinLimit, increaseBinLimit } from "./increaseBinLimit";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("increaseBinLimit", () => {
  it("requires player has resources", () => {
    expect(() =>
      increaseBinLimit({
        state: INITIAL_FARM,
        action: { type: "binLimit.increased" },
        createdAt: Date.now(),
      }),
    ).toThrow("Not enough Iron to increase bin limit");
  });

  it("subtract required resources", () => {
    const state = increaseBinLimit({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Iron: new Decimal(5),
          Leather: new Decimal(5),
          Feather: new Decimal(13),
        },
      },
      action: { type: "binLimit.increased" },
      createdAt: Date.now(),
    });

    expect(state.inventory.Iron).toEqual(new Decimal(2));
    expect(state.inventory.Leather).toEqual(new Decimal(2));
    expect(state.inventory.Feather).toEqual(new Decimal(3));
  });

  it("should increase the bin limit", () => {
    const now = Date.now();
    const state = increaseBinLimit({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Iron: new Decimal(5),
          Leather: new Decimal(5),
          Feather: new Decimal(13),
        },
      },
      action: { type: "binLimit.increased" },
      createdAt: now,
    });

    expect(state.socialFarming.binIncrease?.boughtAt).toEqual([now]);
  });

  it("should increase the bin limit multiple times", () => {
    const now = Date.now();
    let state = increaseBinLimit({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Iron: new Decimal(15),
          Leather: new Decimal(15),
          Feather: new Decimal(130),
        },
      },
      action: { type: "binLimit.increased" },
      createdAt: now,
    });

    state = increaseBinLimit({
      state,
      action: { type: "binLimit.increased" },
      createdAt: now,
    });

    expect(state.socialFarming.binIncrease?.boughtAt).toEqual([now, now]);
  });

  it("removes previous day bin limits", () => {
    const now = Date.now();
    const state = increaseBinLimit({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Iron: new Decimal(15),
          Leather: new Decimal(15),
          Feather: new Decimal(130),
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          binIncrease: {
            boughtAt: [now - 36 * 60 * 60 * 1000],
          },
        },
      },
      action: { type: "binLimit.increased" },
      createdAt: now,
    });

    expect(state.socialFarming.binIncrease?.boughtAt).toEqual([now]);
  });

  describe("getBinLimit", () => {
    it("returns the original bin limit", () => {
      const limit = getBinLimit({ game: INITIAL_FARM });
      expect(limit).toBe(30);
    });

    it("increases the bin limit once", () => {
      const limit = getBinLimit({
        game: {
          ...INITIAL_FARM,
          socialFarming: {
            ...INITIAL_FARM.socialFarming,
            binIncrease: { boughtAt: [Date.now()] },
          },
        },
      });
      expect(limit).toBe(60);
    });

    it("increases the bin limit twice", () => {
      const limit = getBinLimit({
        game: {
          ...INITIAL_FARM,
          socialFarming: {
            ...INITIAL_FARM.socialFarming,
            binIncrease: { boughtAt: [Date.now(), Date.now()] },
          },
        },
      });
      expect(limit).toBe(90);
    });

    it("ignores previous day bin limits", () => {
      const limit = getBinLimit({
        game: {
          ...INITIAL_FARM,
          socialFarming: {
            ...INITIAL_FARM.socialFarming,
            binIncrease: {
              boughtAt: [Date.now(), Date.now() - 25 * 60 * 60 * 1000],
            },
          },
        },
      });
      expect(limit).toBe(60);
    });
  });
});
