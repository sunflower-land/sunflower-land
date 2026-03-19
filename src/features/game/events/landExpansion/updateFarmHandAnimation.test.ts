import { TEST_FARM } from "features/game/lib/constants";
import { updateFarmHandAnimation } from "./updateFarmHandAnimation";

describe("updateFarmHandAnimation", () => {
  it("throws if farm hand does not exist", () => {
    expect(() =>
      updateFarmHandAnimation({
        state: {
          ...TEST_FARM,
          farmHands: {
            bumpkins: {},
          },
        },
        action: {
          type: "farmHand.animationUpdated",
          id: "nonexistent",
          animation: "watering",
        },
      }),
    ).toThrow("Farm hand does not exist");
  });

  it("sets animation to watering", () => {
    const result = updateFarmHandAnimation({
      state: {
        ...TEST_FARM,
        farmHands: {
          bumpkins: {
            "1": {
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
      },
      action: {
        type: "farmHand.animationUpdated",
        id: "1",
        animation: "watering",
      },
    });

    expect(result.farmHands.bumpkins["1"].animation).toBe("watering");
  });

  it("sets animation back to idle", () => {
    const result = updateFarmHandAnimation({
      state: {
        ...TEST_FARM,
        farmHands: {
          bumpkins: {
            "1": {
              equipped: {
                background: "Cemetery Background",
                body: "Beige Farmer Potion",
                hair: "Basic Hair",
                shoes: "Black Farmer Boots",
                tool: "Farmer Pitchfork",
                shirt: "Yellow Farmer Shirt",
                pants: "Farmer Overalls",
              },
              animation: "watering",
            },
          },
        },
      },
      action: {
        type: "farmHand.animationUpdated",
        id: "1",
        animation: "idle",
      },
    });

    expect(result.farmHands.bumpkins["1"].animation).toBe("idle");
  });
});
