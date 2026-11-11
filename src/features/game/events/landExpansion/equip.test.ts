import type { Equipped } from "features/game/types/bumpkin";
import { type EquipBumpkinAction, availableWardrobe, equip } from "./equip";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";

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
      "Basic Hair": 0,
      "Beige Farmer Potion": 0,
      "Cupid Sandals": 0,
      "Farmer Pants": 0,
      "Red Farmer Shirt": 0,
    });
  });
});

const HOUR = 60 * 60 * 1000;
const honeyFarm = (now: number) => ({
  flowers: {
    discovered: {},
    flowerBeds: {
      f1: {
        createdAt: 0,
        x: 0,
        y: 0,
        flower: { name: "Red Pansy" as const, plantedAt: now - HOUR },
      },
    },
  },
  beehives: {
    h1: {
      swarm: false,
      x: 3,
      y: 3,
      honey: { updatedAt: now - HOUR, produced: 0 },
      flowers: [
        {
          id: "f1",
          attachedAt: now - HOUR,
          attachedUntil: now + 11 * HOUR,
          rate: 1,
        },
      ],
    },
  },
});

describe("equip honey rate", () => {
  it("applies the Beekeeper Hat honey rate from the moment it is equipped", () => {
    const now = Date.now();
    const equipped: Equipped = {
      background: "Farm Background",
      hair: "Basic Hair",
      body: "Beige Farmer Potion",
      shirt: "Blue Farmer Shirt",
      pants: "Farmer Overalls",
      shoes: "Black Farmer Boots",
      tool: "Farmer Pitchfork",
    };

    const state = equip({
      state: {
        ...TEST_FARM,
        ...honeyFarm(now),
        bumpkin: { ...INITIAL_BUMPKIN, id: 1, equipped },
        wardrobe: {
          "Farm Background": 1,
          "Basic Hair": 1,
          "Beige Farmer Potion": 1,
          "Blue Farmer Shirt": 1,
          "Farmer Overalls": 1,
          "Black Farmer Boots": 1,
          "Farmer Pitchfork": 1,
          "Beekeeper Hat": 1,
        },
      },
      action: {
        type: "bumpkin.equipped",
        equipment: { ...equipped, hat: "Beekeeper Hat" },
      },
      createdAt: now,
    });

    expect(state.beehives.h1.honey.produced).toEqual(HOUR);
    expect(state.beehives.h1.flowers[0]).toEqual(
      expect.objectContaining({ attachedAt: now, rate: 1.2 }),
    );
  });
});
