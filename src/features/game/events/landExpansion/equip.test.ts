import { Equipped } from "features/game/types/bumpkin";
import { EquipBumpkinAction, availableWardrobe, equip } from "./equip";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

describe("equip", () => {
  const TEST_PARTS: Equipped = {
    background: "Farm Background",
    hair: "Basic Hair",
    body: "Beige Farmer Potion",
    shirt: "Blue Farmer Shirt",
    pants: "Farmer Overalls",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
  };

  const game: GameState = {
    ...TEST_FARM,
    bumpkin: { ...INITIAL_BUMPKIN, id: 1, equipped: TEST_PARTS },
  };

  it("equips clothing", () => {
    const action: EquipBumpkinAction = {
      type: "bumpkin.equipped",
      equipment: { ...TEST_PARTS },
    };
    const result = equip({
      state: {
        ...game,
        wardrobe: {
          "Farm Background": 1,
          "Basic Hair": 1,
          "Beige Farmer Potion": 1,
          "Blue Farmer Shirt": 1,
          "Farmer Overalls": 1,
          "Black Farmer Boots": 1,
          "Farmer Pitchfork": 1,
        },
      },
      action,
    });

    expect(result.bumpkin?.equipped).toEqual(TEST_PARTS);
  });

  it("requires clothing is available", () => {
    const action: EquipBumpkinAction = {
      type: "bumpkin.equipped",
      equipment: { ...TEST_PARTS, shirt: "Red Farmer Shirt" },
    };

    expect(() =>
      equip({
        state: {
          ...game,
          wardrobe: {
            "Farm Background": 1,
            "Basic Hair": 1,
            "Beige Farmer Potion": 1,
            // "Blue Farmer Shirt": 1,
            "Farmer Overalls": 1,
            "Black Farmer Boots": 1,
            "Farmer Pitchfork": 1,
          },
        },
        action,
      }),
    ).toThrow(`Red Farmer Shirt is not available for use`);
  });

  it("throws error if no bumpkin exists", () => {
    const action: EquipBumpkinAction = {
      type: "bumpkin.equipped",
      equipment: TEST_PARTS,
    };
    const gameWithoutBumpkin = { ...game, bumpkin: undefined };

    expect(() => equip({ state: gameWithoutBumpkin, action })).toThrow(
      "You do not have a Bumpkin",
    );
  });

  it("throws error when equipping shirt while wearing dress", () => {
    const action: EquipBumpkinAction = {
      type: "bumpkin.equipped",
      equipment: {
        ...TEST_PARTS,
        dress: "Beach Sarong",
        shirt: "Red Farmer Shirt",
      },
    };

    expect(() => equip({ state: game, action })).toThrow(
      "Cannot equip shirt while wearing dress",
    );
  });

  it("throws error when equipping pants while wearing dress", () => {
    const action: EquipBumpkinAction = {
      type: "bumpkin.equipped",
      equipment: {
        ...TEST_PARTS,
        shirt: undefined,
        dress: "Beach Sarong",
        pants: "Beach Trunks",
      },
    };

    expect(() => equip({ state: game, action })).toThrow(
      "Cannot equip pants while wearing dress",
    );
  });

  it("throws error when shoes are not included in the equipment", () => {
    const equipment = { ...TEST_PARTS, shoes: undefined } as any;
    const action: EquipBumpkinAction = {
      type: "bumpkin.equipped",
      equipment,
    };

    expect(() => equip({ state: game, action })).toThrow(`Shoes are required`);
  });

  it("throws error when body, shoes, or body is not included in the equipment", () => {
    const equipment = { ...TEST_PARTS, body: undefined } as any;
    const action: EquipBumpkinAction = {
      type: "bumpkin.equipped",
      equipment,
    };

    expect(() => equip({ state: game, action })).toThrow(`Body is required`);
  });
  it("throws error when hair is not included in the equipment", () => {
    const equipment = { ...TEST_PARTS, hair: undefined } as any;
    const action: EquipBumpkinAction = {
      type: "bumpkin.equipped",
      equipment,
    };

    expect(() => equip({ state: game, action })).toThrow(`Hair is required`);
  });

  it("throws error when bumpkin is naked", () => {
    const action: EquipBumpkinAction = {
      type: "bumpkin.equipped",
      equipment: {
        body: "Beige Farmer Potion",
        shoes: "Black Farmer Boots",
        hair: "Basic Hair",
      } as any,
    };

    expect(() => equip({ state: game, action })).toThrow("Bumpkin is naked!");
  });
});

describe("availableWardrobe", () => {
  it("returns available items", () => {
    const game: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        equipped: {
          shirt: "Red Farmer Shirt",
          pants: "Farmer Pants",
          background: "Farm Background",
          body: "Beige Farmer Potion",
          hair: "Basic Hair",
          shoes: "Cupid Sandals",
          tool: "Ancient Goblin Sword",
        },
      },
      wardrobe: {
        "Red Farmer Shirt": 1,
        "Blue Farmer Shirt": 1,
        "Farmer Pants": 1,
        "Farm Background": 2,
        "Beige Farmer Potion": 1,
        "Basic Hair": 1,
        "Cupid Sandals": 1,
        "Ancient Goblin Sword": 2,
      },
    };

    const result = availableWardrobe(game);
    expect(result).toEqual({
      "Blue Farmer Shirt": 1,
      "Farm Background": 1,
      "Ancient Goblin Sword": 1,
    });
  });
});
