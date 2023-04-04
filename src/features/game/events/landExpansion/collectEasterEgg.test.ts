import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { collectEasterEgg } from "./collectEasterEgg";

describe("collecteEasterEgg", () => {
  it("throws an error if bumpkin does not exist", () => {
    expect(() =>
      collectEasterEgg({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
          easterHunt: {
            generatedAt: 0,
            eggs: [
              {
                x: 1,
                y: 1,
                island: "Main",
                name: "Pink Egg",
                collectedAt: 0,
              },
            ],
          },
        },
        action: {
          type: "easterEgg.collected",
          egg: { x: 1, y: 1, island: "Main", name: "Pink Egg", collectedAt: 0 },
        },
        createdAt: 0,
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("throws an error if egg does not exist", () => {
    expect(() =>
      collectEasterEgg({
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          easterHunt: {
            generatedAt: 0,
            eggs: [],
          },
        },
        action: {
          type: "easterEgg.collected",
          egg: {
            x: 1,
            y: 1,
            island: "Main",
            name: "Pink Egg",
          },
        },
        createdAt: 0,
      })
    ).toThrow("Easter egg does not exist");
  });

  it("throws an error if egg has already been collected", () => {
    expect(() =>
      collectEasterEgg({
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          easterHunt: {
            generatedAt: 0,
            eggs: [
              {
                x: 1,
                y: 1,
                island: "Main",
                name: "Pink Egg",
                collectedAt: Date.now(),
              },
            ],
          },
        },
        action: {
          type: "easterEgg.collected",
          egg: {
            x: 1,
            y: 1,
            island: "Main",
            name: "Pink Egg",
          },
        },
        createdAt: 0,
      })
    ).toThrow("Easter egg has already been collected");
  });
});
