import { TEST_FARM } from "features/game/lib/constants";
import { reelRod } from "./reelRod";
import Decimal from "decimal.js-light";

const farm = { ...TEST_FARM };

describe("reelRod", () => {
  it("requires player has casted", () => {
    expect(() =>
      reelRod({
        action: {
          type: "rod.reeled",
        },
        state: farm,
      })
    ).toThrow("Nothing has been casted");
  });

  it("claims the fish", () => {
    const state = reelRod({
      action: {
        type: "rod.reeled",
      },
      state: {
        ...farm,
        inventory: { Seaweed: new Decimal(5) },
        fishing: {
          wharf: {
            castedAt: 10000010,
            caught: { Gold: 2, Seaweed: 1 },
          },
        },
      },
    });

    expect(state.inventory.Gold).toEqual(new Decimal(2));
    expect(state.inventory["Seaweed"]).toEqual(new Decimal(6));
  });

  it("resets the location", () => {
    const state = reelRod({
      action: {
        type: "rod.reeled",
      },
      state: {
        ...farm,
        fishing: {
          wharf: {
            castedAt: 10000010,
            caught: { Gold: 2, Seaweed: 1 },
            chum: "Sunflower",
          },
        },
      },
    });

    expect(state.fishing.wharf.castedAt).toBeUndefined();
    expect(state.fishing.wharf.caught).toBeUndefined();
    expect(state.fishing.wharf.chum).toBeUndefined();
  });
});
