import "lib/__mocks__/configMock";

import { Bud } from "../types/buds";
import { getBudSpeedBoosts } from "./getBudSpeedBoosts";

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

describe("getBudSpeedBoosts", () => {
  it("returns 1 if no buds", () => {
    expect(getBudSpeedBoosts({}, "Sunflower")).toEqual(1);
  });

  it("returns 0.9 if Saphiro type", () => {
    expect(
      getBudSpeedBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Saphiro",
          },
        },
        "Sunflower",
      ),
    ).toEqual(0.9);
  });

  it("returns 0.895 if Saphiro type and Basic Aura", () => {
    expect(
      getBudSpeedBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Saphiro",
            aura: "Basic",
          },
        },
        "Sunflower",
      ),
    ).toEqual(0.895);
  });
  8;

  it("returns 0.88 if Saphiro type and Green Aura", () => {
    expect(
      getBudSpeedBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Saphiro",
            aura: "Green",
          },
        },
        "Sunflower",
      ),
    ).toEqual(0.88);
  });
  it("returns 0.8 if Saphiro type and Rare Aura", () => {
    expect(
      getBudSpeedBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Saphiro",
            aura: "Rare",
          },
        },
        "Sunflower",
      ),
    ).toEqual(0.8);
  });

  it("returns 0.5 if Saphiro type and Mythical Aura", () => {
    expect(
      getBudSpeedBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Saphiro",
            aura: "Mythical",
          },
        },
        "Sunflower",
      ),
    ).toEqual(0.5);
  });

  it("returns the best boost if multiple buds", () => {
    expect(
      getBudSpeedBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Saphiro",
            aura: "No Aura",
          },
          2: {
            ...NON_BOOSTED_TRAITS,
            type: "Saphiro",
            aura: "Mythical",
          },
          3: {
            ...NON_BOOSTED_TRAITS,
            type: "Saphiro",
            aura: "Rare",
          },
        },
        "Sunflower",
      ),
    ).toEqual(0.5);
  });

  it("filters out buds that are not placed", () => {
    expect(
      getBudSpeedBoosts(
        {
          1: {
            ...NON_BOOSTED_TRAITS,
            type: "Saphiro",
            aura: "Mythical",
            coordinates: undefined,
          },
        },
        "Sunflower",
      ),
    ).toEqual(1);
  });
});
