import "lib/__mocks__/configMock";

import { Bud } from "../types/buds";
import { getBudExperienceBoosts } from "./getBudExperienceBoosts";
import { CONSUMABLES } from "../types/consumables";

const NON_BOOSTED_TRAITS: Omit<Bud, "type"> = {
  aura: "No Aura",
  colour: "Blue",
  ears: "No Ears",
  stem: "Seashell",
  coordinates: {
    x: 0,
    y: 0,
  },
};

describe("getBudExperienceBoosts", () => {
  it("returns 1 if no buds", () => {
    expect(getBudExperienceBoosts({}, CONSUMABLES["Chowder"])).toEqual(1);
  });

  it("returns 1 if no port buds", () => {
    expect(
      getBudExperienceBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Woodlands",
          },
        },
        CONSUMABLES["Chowder"],
      ),
    ).toEqual(1);
  });

  it("returns 1.1 if Port type", () => {
    expect(
      getBudExperienceBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Port",
          },
        },
        CONSUMABLES["Chowder"],
      ),
    ).toEqual(1.1);
  });

  it("returns 1.105 if Port type and Basic Aura", () => {
    expect(
      getBudExperienceBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Port",
            aura: "Basic",
          },
        },
        CONSUMABLES["Chowder"],
      ),
    ).toEqual(1.105);
  });

  it("returns 1.12 if Port type and Green Aura", () => {
    expect(
      getBudExperienceBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Port",
            aura: "Green",
          },
        },
        CONSUMABLES["Chowder"],
      ),
    ).toEqual(1.12);
  });

  it("returns 1.2 if Port type and Rare Aura", () => {
    expect(
      getBudExperienceBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Port",
            aura: "Rare",
          },
        },
        CONSUMABLES["Chowder"],
      ),
    ).toEqual(1.2);
  });

  it("returns 1.5 if Port type and Mythical Aura", () => {
    expect(
      getBudExperienceBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Port",
            aura: "Mythical",
          },
        },
        CONSUMABLES["Chowder"],
      ),
    ).toEqual(1.5);
  });

  it("returns the best boost if multiple buds", () => {
    expect(
      getBudExperienceBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Port",
            aura: "No Aura",
          },
          2: {
            ...NON_BOOSTED_TRAITS,
            type: "Port",
            aura: "Mythical",
          },
          3: {
            ...NON_BOOSTED_TRAITS,
            type: "Port",
            aura: "Rare",
          },
        },
        CONSUMABLES["Chowder"],
      ),
    ).toEqual(1.5);
  });

  it("filters out buds that are not placed", () => {
    expect(
      getBudExperienceBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Port",
            aura: "Mythical",
            coordinates: undefined,
          },
        },
        CONSUMABLES["Chowder"],
      ),
    ).toEqual(1);
  });
});
