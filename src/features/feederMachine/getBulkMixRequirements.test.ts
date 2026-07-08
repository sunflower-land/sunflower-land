import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { Animal } from "features/game/types/game";
import { getBulkMixRequirements } from "./getBulkMixRequirements";

describe("getBulkMixRequirements", () => {
  const chicken = (state: Animal["state"]): Animal => ({
    id: "0",
    type: "Chicken",
    createdAt: 0,
    state,
    experience: 0,
    asleepAt: 0,
    awakeAt: 0,
    lovedAt: 0,
    item: "Petting Hand",
  });

  it("includes awake animals that are sad after a feed but still need food", () => {
    const { requests, missingRequests } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {},
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": chicken("sad"),
          },
        },
      },
      "Hen House",
    );

    expect(Object.values(requests).some((amount) => amount?.gt(0))).toBe(true);
    expect(Object.values(missingRequests).some((amount) => amount?.gt(0))).toBe(
      true,
    );
  });

  it("does not request feed for ready animals", () => {
    const { requests, missingRequests } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {
          "Mixed Grain": new Decimal(100),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": chicken("ready"),
          },
        },
      },
      "Hen House",
    );

    expect(requests).toEqual({});
    expect(missingRequests).toEqual({});
  });
});
