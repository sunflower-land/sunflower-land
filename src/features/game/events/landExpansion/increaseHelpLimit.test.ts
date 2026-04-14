import Decimal from "decimal.js-light";
import { increaseHelpLimit } from "./increaseHelpLimit";
import { getHelpLimit } from "features/game/types/monuments";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("increaseHelpLimit", () => {
  it("requires player has resources", () => {
    expect(() =>
      increaseHelpLimit({
        visitorState: INITIAL_FARM,
        state: INITIAL_FARM,
        action: { type: "helpLimit.increased" },
        createdAt: Date.now(),
      }),
    ).toThrow("Not enough Iron to increase help limit");
  });

  it("subtract required resources", () => {
    const [_, state] = increaseHelpLimit({
      visitorState: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Iron: new Decimal(5),
          Leather: new Decimal(5),
          Wool: new Decimal(5),
          Feather: new Decimal(13),
        },
      },
      state: INITIAL_FARM,
      action: { type: "helpLimit.increased" },
      createdAt: Date.now(),
    });

    expect(state.inventory.Iron).toEqual(new Decimal(4));
    expect(state.inventory.Leather).toEqual(new Decimal(5));
    expect(state.inventory.Wool).toEqual(new Decimal(2));
    expect(state.inventory.Feather).toEqual(new Decimal(10));
  });

  it("should increase the help limit", () => {
    const now = Date.now();
    const [_, state] = increaseHelpLimit({
      visitorState: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Iron: new Decimal(5),
          Leather: new Decimal(5),
          Wool: new Decimal(5),
          Feather: new Decimal(13),
        },
      },
      state: INITIAL_FARM,
      action: { type: "helpLimit.increased" },
      createdAt: now,
    });

    expect(state.socialFarming.helpIncrease?.boughtAt).toEqual([now]);
  });

  it("should increase the help limit multiple times", () => {
    const now = Date.now();
    let [_, state] = increaseHelpLimit({
      visitorState: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Iron: new Decimal(15),
          Leather: new Decimal(15),
          Wool: new Decimal(15),
          Feather: new Decimal(130),
        },
      },
      state: INITIAL_FARM,
      action: { type: "helpLimit.increased" },
      createdAt: now,
    });

    [_, state] = increaseHelpLimit({
      visitorState: state,
      state: INITIAL_FARM,
      action: { type: "helpLimit.increased" },
      createdAt: now,
    });

    expect(state.socialFarming.helpIncrease?.boughtAt).toEqual([now, now]);
  });

  it("removes previous day help limits", () => {
    const now = Date.now();
    const [_, state] = increaseHelpLimit({
      visitorState: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Iron: new Decimal(15),
          Leather: new Decimal(15),
          Wool: new Decimal(15),
          Feather: new Decimal(130),
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          helpIncrease: {
            boughtAt: [now - 36 * 60 * 60 * 1000],
          },
        },
      },
      state: INITIAL_FARM,
      action: { type: "helpLimit.increased" },
      createdAt: now,
    });

    expect(state.socialFarming.helpIncrease?.boughtAt).toEqual([now]);
  });

  describe("getHelpLimit", () => {
    it("returns the original help limit", () => {
      const limit = getHelpLimit({ game: INITIAL_FARM });
      expect(limit).toBe(5);
    });

    it("increases the help limit once", () => {
      const limit = getHelpLimit({
        game: {
          ...INITIAL_FARM,
          socialFarming: {
            ...INITIAL_FARM.socialFarming,
            helpIncrease: {
              boughtAt: [Date.now()],
            },
          },
        },
      });
      expect(limit).toBe(6);
    });

    it("increases the help limit twice", () => {
      const limit = getHelpLimit({
        game: {
          ...INITIAL_FARM,
          socialFarming: {
            ...INITIAL_FARM.socialFarming,
            helpIncrease: {
              boughtAt: [Date.now(), Date.now()],
            },
          },
        },
      });
      expect(limit).toBe(7);
    });
  });
});
