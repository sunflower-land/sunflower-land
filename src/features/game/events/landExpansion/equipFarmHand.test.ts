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
