import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { Animal } from "features/game/types/game";
import { getBulkMixRequirements } from "./getBulkMixRequirements";

describe("getBulkMixRequirements", () => {
  const animal = ({
    state,
    type,
  }: {
    state: Animal["state"];
    type: Animal["type"];
  }): Animal => ({
    id: "0",
    type,
    createdAt: 0,
    state,
    experience: 0,
    asleepAt: 0,
    awakeAt: 0,
    lovedAt: 0,
    item: "Petting Hand",
  });

  const chicken = (state: Animal["state"]) =>
    animal({ state, type: "Chicken" });

  it("includes awake animals that are sad after a feed but still need food", () => {
    const { requests, missingRequests, requirements } = getBulkMixRequirements(
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

    expect(requests["Kernel Blend"]).toEqual(new Decimal(1));
    expect(missingRequests["Kernel Blend"]).toEqual(new Decimal(1));
    expect(requirements.ingredients.Corn).toEqual(new Decimal(1));
    expect(requirements.coins).toBe(0);
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

  it("calculates barn feed requirements", () => {
    const { requests, missingRequests, requirements } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {},
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": animal({ state: "idle", type: "Cow" }),
          },
        },
      },
      "Barn",
    );

    expect(requests["Kernel Blend"]).toEqual(new Decimal(15));
    expect(missingRequests["Kernel Blend"]).toEqual(new Decimal(15));
    expect(requirements.ingredients.Corn).toEqual(new Decimal(15));
    expect(requirements.coins).toBe(0);
  });
});
