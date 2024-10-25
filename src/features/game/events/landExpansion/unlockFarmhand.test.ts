import { FARMHANDS, unlockFarmhand } from "./unlockFarmhand";
import { INITIAL_FARM } from "features/game/lib/constants";
import { getKeys } from "features/game/types/decorations";

describe("unlockFarmhand", () => {
  it("throws if the player has one only has a basic bed", () => {
    expect(() =>
      unlockFarmhand({
        action: {
          type: "farmHand.unlocked",
        },
        state: {
          ...INITIAL_FARM,
          collectibles: {
            "Basic Bed": [
              {
                coordinates: { x: 0, y: 0 },
                id: "1",
                readyAt: 0,
                createdAt: 0,
              },
            ],
          },
        },
      }),
    ).toThrow("No beds available");
  });

  it("unlocks a farmhand if the player has a basic bed and a fisher bed", () => {
    const state = unlockFarmhand({
      state: {
        ...INITIAL_FARM,
        collectibles: {
          "Basic Bed": [
            { coordinates: { x: 0, y: 0 }, id: "1", readyAt: 0, createdAt: 0 },
          ],
          "Fisher Bed": [
            { coordinates: { x: 0, y: 0 }, id: "2", readyAt: 0, createdAt: 0 },
          ],
        },
      },
      action: { type: "farmHand.unlocked" },
    });

    expect(Object.keys(state.farmHands.bumpkins).length).toEqual(1);
  });

  it("populates the wardrobe with the correct items", () => {
    const state = unlockFarmhand({
      state: {
        ...INITIAL_FARM,
        collectibles: {
          "Basic Bed": [
            { coordinates: { x: 0, y: 0 }, id: "1", readyAt: 0, createdAt: 0 },
          ],
          "Fisher Bed": [
            { coordinates: { x: 0, y: 0 }, id: "2", readyAt: 0, createdAt: 0 },
          ],
        },
      },
      action: { type: "farmHand.unlocked" },
    });

    expect(state.farmHands.bumpkins[1].equipped).toEqual(FARMHANDS[0]);
    for (const key of getKeys(FARMHANDS[0])) {
      const item = FARMHANDS[0][key];
      expect(state.wardrobe[item!]).toEqual(1);
    }
  });
});
