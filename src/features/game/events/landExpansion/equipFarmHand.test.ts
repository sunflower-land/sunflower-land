import { TEST_FARM } from "features/game/lib/constants";
import { equipFarmhand } from "./equipFarmHand";

describe("equipFarmHand", () => {
  it("requires a farm hand exists", () => {
    expect(() =>
      equipFarmhand({
        action: {
          type: "farmHand.equipped",
          equipment: {
            background: "Cemetery Background",
            body: "Beige Farmer Potion",
            hair: "Basic Hair",
            shoes: "Black Farmer Boots",
            tool: "Farmer Pitchfork",
            shirt: "Yellow Farmer Shirt",
            pants: "Farmer Overalls",
          },
          id: "60",
        },
        state: {
          ...TEST_FARM,
          farmHands: {
            bumpkins: {
              "65": {
                equipped: {
                  background: "Cemetery Background",
                  body: "Beige Farmer Potion",
                  hair: "Basic Hair",
                  shoes: "Black Farmer Boots",
                  tool: "Farmer Pitchfork",
                  shirt: "Yellow Farmer Shirt",
                  pants: "Farmer Overalls",
                },
              },
            },
          },
          wardrobe: {
            "Cemetery Background": 3,
            "Beige Farmer Potion": 3,
            "Basic Hair": 3,
            "Black Farmer Boots": 3,
            "Farmer Pitchfork": 3,
            "Yellow Farmer Shirt": 3,
            "Farmer Overalls": 3,
          },
        },
      }),
    ).toThrow(`Farm hand does not exist`);
  });

  it("requires clothing is not in use", () => {
    expect(() =>
      equipFarmhand({
        action: {
          type: "farmHand.equipped",
          equipment: {
            background: "Cemetery Background",
            body: "Beige Farmer Potion",
            hair: "Basic Hair",
            shoes: "Black Farmer Boots",
            tool: "Farmer Pitchfork",
            shirt: "Red Farmer Shirt",
            pants: "Farmer Overalls",
          },
          id: "60",
        },
        state: {
          ...TEST_FARM,
          farmHands: {
            bumpkins: {
              "60": {
                equipped: {
                  background: "Cemetery Background",
                  body: "Beige Farmer Potion",
                  hair: "Basic Hair",
                  shoes: "Black Farmer Boots",
                  tool: "Farmer Pitchfork",
                  shirt: "Yellow Farmer Shirt",
                  pants: "Farmer Overalls",
                },
              },
            },
          },
          wardrobe: {
            "Cemetery Background": 3,
            "Beige Farmer Potion": 3,
            "Basic Hair": 3,
            "Black Farmer Boots": 3,
            "Farmer Pitchfork": 3,
            "Yellow Farmer Shirt": 3,
            "Farmer Overalls": 3,
          },
        },
      }),
    ).toThrow(`Red Farmer Shirt is not available for use`);
  });

  it("equips a farm hand", () => {
    const state = equipFarmhand({
      action: {
        type: "farmHand.equipped",
        equipment: {
          background: "Cemetery Background",
          body: "Beige Farmer Potion",
          hair: "Basic Hair",
          shoes: "Black Farmer Boots",
          tool: "Farmer Pitchfork",
          shirt: "Red Farmer Shirt",
          pants: "Farmer Overalls",
        },
        id: "60",
      },
      state: {
        ...TEST_FARM,
        farmHands: {
          bumpkins: {
            "60": {
              equipped: {
                background: "Cemetery Background",
                body: "Beige Farmer Potion",
                hair: "Basic Hair",
                shoes: "Black Farmer Boots",
                tool: "Farmer Pitchfork",
                shirt: "Yellow Farmer Shirt",
                pants: "Farmer Overalls",
              },
            },
          },
        },
        wardrobe: {
          "Cemetery Background": 3,
          "Beige Farmer Potion": 3,
          "Basic Hair": 3,
          "Black Farmer Boots": 3,
          "Farmer Pitchfork": 3,
          "Yellow Farmer Shirt": 3,
          "Red Farmer Shirt": 3,
          "Farmer Overalls": 3,
        },
      },
    });

    expect(state.farmHands.bumpkins).toEqual({
      "60": {
        equipped: {
          background: "Cemetery Background",
          body: "Beige Farmer Potion",
          hair: "Basic Hair",
          shoes: "Black Farmer Boots",
          tool: "Farmer Pitchfork",
          shirt: "Red Farmer Shirt",
          pants: "Farmer Overalls",
        },
      },
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

describe("equipFarmHand honey rate", () => {
  it("applies the Beekeeper Hat honey rate when a farm hand equips it", () => {
    const now = Date.now();
    const equipped = {
      background: "Cemetery Background",
      body: "Beige Farmer Potion",
      hair: "Basic Hair",
      shoes: "Black Farmer Boots",
      tool: "Farmer Pitchfork",
      shirt: "Yellow Farmer Shirt",
      pants: "Farmer Overalls",
    } as const;

    const state = equipFarmhand({
      action: {
        type: "farmHand.equipped",
        equipment: { ...equipped, hat: "Beekeeper Hat" },
        id: "65",
      },
      state: {
        ...TEST_FARM,
        ...honeyFarm(now),
        farmHands: { bumpkins: { "65": { equipped } } },
        wardrobe: {
          "Cemetery Background": 1,
          "Beige Farmer Potion": 1,
          "Basic Hair": 1,
          "Black Farmer Boots": 1,
          "Farmer Pitchfork": 1,
          "Yellow Farmer Shirt": 1,
          "Farmer Overalls": 1,
          "Beekeeper Hat": 1,
        },
      },
      createdAt: now,
    });

    expect(state.beehives.h1.honey.produced).toEqual(HOUR);
    expect(state.beehives.h1.flowers[0]).toEqual(
      expect.objectContaining({ attachedAt: now, rate: 1.2 }),
    );
  });
});
