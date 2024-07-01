import "lib/__mocks__/configMock";

import { Bud } from "../types/buds";
import { getBudYieldBoosts } from "./getBudYieldBoosts";

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

describe("getBudYieldBoosts", () => {
  it("returns zero if no buds", () => {
    expect(getBudYieldBoosts({}, "Stone")).toEqual(0);
  });

  it("returns 0 for a Basic Aura without a trait active", () => {
    expect(
      getBudYieldBoosts(
        { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza", aura: "Basic" } },
        "Stone",
      ),
    ).toEqual(0);
  });

  it("returns the boost from the most powerful bud", () => {
    expect(
      getBudYieldBoosts(
        {
          1: { ...NON_BOOSTED_TRAITS, type: "Plaza" },
          2: { ...NON_BOOSTED_TRAITS, type: "Cave", aura: "Basic" },
          3: { ...NON_BOOSTED_TRAITS, type: "Cave" },
        },
        "Stone",
      ),
    ).toEqual(0.21);
  });

  it("filters out buds that are not placed", () => {
    expect(
      getBudYieldBoosts(
        {
          1: { ...NON_BOOSTED_TRAITS, type: "Plaza", coordinates: undefined },
          2: {
            ...NON_BOOSTED_TRAITS,
            type: "Cave",
            aura: "Basic",
            coordinates: undefined,
          },
          3: { ...NON_BOOSTED_TRAITS, type: "Cave", coordinates: undefined },
        },
        "Stone",
      ),
    ).toEqual(0);
  });

  describe("Minerals", () => {
    it("returns 0.2 Stone boost for a Cave type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave" } },
          "Stone",
        ),
      ).toEqual(0.2);
    });

    it("returns 0.2 Iron boost for a Cave type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave" } },
          "Iron",
        ),
      ).toEqual(0.2);
    });

    it("returns 0.2 Gold boost for a Cave type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave" } },
          "Gold",
        ),
      ).toEqual(0.2);
    });

    it("returns 0 Stone boost for a Plaza type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza" } },
          "Stone",
        ),
      ).toEqual(0);
    });

    it("returns 0.2 Stone boost for a Diamond Gem stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza", stem: "Diamond Gem" } },
          "Stone",
        ),
      ).toEqual(0.2);
    });

    it("returns 0.4 Stone boost for a Cave type with Diamond Gem stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Diamond Gem" } },
          "Stone",
        ),
      ).toEqual(0.4);
    });

    it("returns 0.2 Gold boost for a Gold Gem stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza", stem: "Gold Gem" } },
          "Gold",
        ),
      ).toEqual(0.2);
    });

    it("returns 0.4 Gold boost for a Cave type with Gold Gem stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Gold Gem" } },
          "Gold",
        ),
      ).toEqual(0.4);
    });

    it("returns 0.2 Iron boost for a Miner Hat stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza", stem: "Miner Hat" } },
          "Iron",
        ),
      ).toEqual(0.2);
    });

    it("returns 0.4 Iron boost for a Cave type with Miner Hat stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Miner Hat" } },
          "Iron",
        ),
      ).toEqual(0.4);
    });

    it("returns 0.2 Stone boost for a Ruby Gem stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza", stem: "Ruby Gem" } },
          "Stone",
        ),
      ).toEqual(0.2);
    });

    it("returns 0.4 Stone boost for a Cave type with Ruby Gem stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Ruby Gem" } },
          "Stone",
        ),
      ).toEqual(0.4);
    });

    it("returns 0.21 Stone boost for a Ruby Gem stem and Basic Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Plaza",
              stem: "Ruby Gem",
              aura: "Basic",
            },
          },
          "Stone",
        ),
      ).toEqual(0.21);
    });

    it("returns 0.42 Stone boost for a Cave type with Ruby Gem stem and Basic Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Cave",
              stem: "Ruby Gem",
              aura: "Basic",
            },
          },
          "Stone",
        ),
      ).toEqual(0.42);
    });

    it("returns 0.24 Stone boost for a Ruby Gem stem and Green Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Plaza",
              stem: "Ruby Gem",
              aura: "Green",
            },
          },
          "Stone",
        ),
      ).toEqual(0.24);
    });

    it("returns 0.48 Stone boost for a Cave type with Ruby Gem stem and Green Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Cave",
              stem: "Ruby Gem",
              aura: "Green",
            },
          },
          "Stone",
        ),
      ).toEqual(0.48);
    });

    it("returns 0.4 Stone boost for a Ruby Gem stem and Rare Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Plaza",
              stem: "Ruby Gem",
              aura: "Rare",
            },
          },
          "Stone",
        ),
      ).toEqual(0.4);
    });

    it("returns 0.8 Stone boost for a Cave type with Ruby Gem stem and Rare Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Cave",
              stem: "Ruby Gem",
              aura: "Rare",
            },
          },
          "Stone",
        ),
      ).toEqual(0.8);
    });

    it("returns 1 Stone boost for a Ruby Gem stem and Mythical Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Plaza",
              stem: "Ruby Gem",
              aura: "Mythical",
            },
          },
          "Stone",
        ),
      ).toEqual(1);
    });

    it("returns 2 Stone boost for a Cave type with Ruby Gem stem and Mythical Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Cave",
              stem: "Ruby Gem",
              aura: "Mythical",
            },
          },
          "Stone",
        ),
      ).toEqual(2);
    });
  });

  describe("Crops", () => {
    it("returns 0 Crop boost for a Cave type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave" } },
          "Sunflower",
        ),
      ).toEqual(0);
    });

    it("returns 0.5 Crop boost for a 3 Leaf Clover stem", () => {
      expect(
        getBudYieldBoosts(
          {
            1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "3 Leaf Clover" },
          },
          "Sunflower",
        ),
      ).toEqual(0.5);
    });

    it("returns 0.8 Sunflower Boost for a Plaza type with a 3 Leaf Clover stem", () => {
      expect(
        getBudYieldBoosts(
          {
            1: { ...NON_BOOSTED_TRAITS, type: "Plaza", stem: "3 Leaf Clover" },
          },
          "Sunflower",
        ),
      ).toEqual(0.8);
    });

    it("returns 0.3 Carrot Boost for a a Carrot Head stem", () => {
      expect(
        getBudYieldBoosts(
          {
            1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Carrot Head" },
          },
          "Carrot",
        ),
      ).toEqual(0.3);
    });

    it("returns 0.5 Sunflower Boost for a Sunflower Hat stem", () => {
      expect(
        getBudYieldBoosts(
          {
            1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Sunflower Hat" },
          },
          "Sunflower",
        ),
      ).toEqual(0.5);
    });

    it("returns 0.8 Sunflower Boost for a Plaza type with a Sunflower Hat stem", () => {
      expect(
        getBudYieldBoosts(
          {
            1: { ...NON_BOOSTED_TRAITS, type: "Plaza", stem: "Sunflower Hat" },
          },
          "Sunflower",
        ),
      ).toEqual(0.8);
    });

    it("returns 0.21 Sunflower Boost for a Basic Leaf stem and Basic Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Cave",
              stem: "Basic Leaf",
              aura: "Basic",
            },
          },
          "Sunflower",
        ),
      ).toEqual(0.21);
    });

    it("returns 0.6 Sunflower Boost for a Plaza type with Basic Leaf stem and Green Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Plaza",
              stem: "Basic Leaf",
              aura: "Green",
            },
          },
          "Sunflower",
        ),
      ).toEqual(0.6);
    });

    it("returns 0.4 Sunflower Boost for a Basic Leaf stem and Rare Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Cave",
              stem: "Basic Leaf",
              aura: "Rare",
            },
          },
          "Sunflower",
        ),
      ).toEqual(0.4);
    });

    it("returns 1 Sunflower Boost for a Plaza type with Basic Leaf stem and Rare Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Plaza",
              stem: "Basic Leaf",
              aura: "Rare",
            },
          },
          "Sunflower",
        ),
      ).toEqual(1);
    });

    it("returns 1 Sunflower Boost for a Basic Leaf stem and Mythical Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Cave",
              stem: "Basic Leaf",
              aura: "Mythical",
            },
          },
          "Sunflower",
        ),
      ).toEqual(1);
    });

    it("returns 2.5 Sunflower Boost for a Plaza type with Basic Leaf stem and Mythical Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Plaza",
              stem: "Basic Leaf",
              aura: "Mythical",
            },
          },
          "Sunflower",
        ),
      ).toEqual(2.5);
    });

    it("returns 4 Sunflower Boost for a Plaza type with 3 Leaf Clover stem and Mythical Aura", () => {
      expect(
        getBudYieldBoosts(
          {
            1: {
              ...NON_BOOSTED_TRAITS,
              type: "Plaza",
              stem: "3 Leaf Clover",
              aura: "Mythical",
            },
          },
          "Sunflower",
        ),
      ).toEqual(4);
    });
  });

  describe("Basic Crops", () => {
    it("returns 0.3 Sunflower Boost for a Plaza type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza" } },
          "Sunflower",
        ),
      ).toEqual(0.3);
    });

    it("returns 0 Eggplant Boost for a Plaza type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza" } },
          "Eggplant",
        ),
      ).toEqual(0);
    });

    it("returns 0.2 Sunflower Boost for a Basic Leaf stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Basic Leaf" } },
          "Sunflower",
        ),
      ).toEqual(0.2);
    });
  });

  describe("Medium Crops", () => {
    it("returns 0 Sunflower Boost for a Castle type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Castle" } },
          "Sunflower",
        ),
      ).toEqual(0);
    });

    it("returns 0.3 Cauliflower Boost for a Castle type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Castle" } },
          "Cauliflower",
        ),
      ).toEqual(0.3);
    });
  });

  describe("Advanced Crops", () => {
    it("returns 0 Sunflower Boost for a Snow type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Snow" } },
          "Sunflower",
        ),
      ).toEqual(0);
    });

    it("returns 0.3 Eggplant Boost for a Snow type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Snow" } },
          "Eggplant",
        ),
      ).toEqual(0.3);
    });
  });

  describe("Wood", () => {
    it("returns 0.2 Wood Boost for a Woodlands type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Woodlands" } },
          "Wood",
        ),
      ).toEqual(0.2);
    });

    it("returns 0 Wood Boost for a Plaza type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza" } },
          "Wood",
        ),
      ).toEqual(0);
    });

    it("returns 0.1 Wood Boost for a Acorn Hat stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Acorn Hat" } },
          "Wood",
        ),
      ).toEqual(0.1);
    });

    it("returns 0.3 Wood Boost for a Woodlands type with Acorn Hat stem", () => {
      expect(
        getBudYieldBoosts(
          {
            1: { ...NON_BOOSTED_TRAITS, type: "Woodlands", stem: "Acorn Hat" },
          },
          "Wood",
        ),
      ).toEqual(0.3);
    });

    it("returns 0.2 Wood Boost for a Tree Hat stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Tree Hat" } },
          "Wood",
        ),
      ).toEqual(0.2);
    });

    it("returns 0.4 Wood Boost for a Woodlands type with Tree Hat stem", () => {
      expect(
        getBudYieldBoosts(
          {
            1: { ...NON_BOOSTED_TRAITS, type: "Woodlands", stem: "Tree Hat" },
          },
          "Wood",
        ),
      ).toEqual(0.4);
    });
  });

  describe("Animals", () => {
    it("returns 0.2 Animal produce for a Retreat type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Retreat" } },
          "Egg",
        ),
      ).toEqual(0.2);
    });

    it("returns 0 Animal produce for a Plaza type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza" } },
          "Egg",
        ),
      ).toEqual(0);
    });

    it("returns 0.2 Eggs for a Egg Head stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Egg Head" } },
          "Egg",
        ),
      ).toEqual(0.2);
    });

    it("returns 0.4 Eggs for a Retreat type with Egg Head stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Retreat", stem: "Egg Head" } },
          "Egg",
        ),
      ).toEqual(0.4);
    });
  });

  describe("Fruit", () => {
    it("returns 0.2 Fruit produce for a Beach type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Beach" } },
          "Apple",
        ),
      ).toEqual(0.2);
    });

    it("returns 0 Fruit produce for a Plaza type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza" } },
          "Apple",
        ),
      ).toEqual(0);
    });

    it("returns 0.2 Fruit produce for a Banana stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Banana" } },
          "Apple",
        ),
      ).toEqual(0.2);
    });

    it("returns 0.4 Fruit produce for a Beach type with a Banana stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Beach", stem: "Banana" } },
          "Apple",
        ),
      ).toEqual(0.4);
    });

    it("returns 0.2 Fruit produce for a Apple Head stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Apple Head" } },
          "Apple",
        ),
      ).toEqual(0.2);
    });

    it("returns 0.4 Fruit produce for a Beach type with a Apple Head stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Beach", stem: "Apple Head" } },
          "Apple",
        ),
      ).toEqual(0.4);
    });
  });

  describe("Mushrooms", () => {
    it("returns 0 Mushroom produce for a Plaza type", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Plaza" } },
          "Wild Mushroom",
        ),
      ).toEqual(0);
    });

    it("returns 0.3 Wild Mushroom produce for a Mushroom stem", () => {
      expect(
        getBudYieldBoosts(
          { 1: { ...NON_BOOSTED_TRAITS, type: "Cave", stem: "Mushroom" } },
          "Wild Mushroom",
        ),
      ).toEqual(0.3);
    });

    it("returns 0.2 Magic Mushroom produce for a Magic Mushroom stem", () => {
      expect(
        getBudYieldBoosts(
          {
            1: { ...NON_BOOSTED_TRAITS, type: "Plaza", stem: "Magic Mushroom" },
          },
          "Magic Mushroom",
        ),
      ).toEqual(0.2);
    });
  });
});
