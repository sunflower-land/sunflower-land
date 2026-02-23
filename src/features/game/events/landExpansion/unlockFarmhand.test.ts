import { FARMHANDS, unlockFarmhand } from "./unlockFarmhand";
import { INITIAL_FARM } from "features/game/lib/constants";
import { getKeys } from "features/game/types/decorations";
import { BED_FARMHAND_COUNT } from "features/game/types/beds";
import { BedName } from "features/game/types/game";

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

  it("has at least 10 farmhand outfits (supports up to Pearl Bed slots)", () => {
    expect(FARMHANDS.length).toBeGreaterThanOrEqual(10);
  });

  it("unlocks the 10th farmhand when player has 11 beds and 9 existing farmhands", () => {
    const placed = {
      coordinates: { x: 0, y: 0 },
      id: "1",
      readyAt: 0,
      createdAt: 0,
    };
    const collectibles = getKeys(BED_FARMHAND_COUNT).reduce(
      (acc, bedName) => ({
        ...acc,
        [bedName]: [placed],
      }),
      {} as Record<BedName, (typeof placed)[]>,
    );
    const bumpkins: Record<string, { equipped: (typeof FARMHANDS)[number] }> =
      {};
    for (let i = 1; i <= 9; i++) {
      bumpkins[i] = { equipped: FARMHANDS[i - 1] };
    }
    const stateWith9Farmhands = {
      ...INITIAL_FARM,
      collectibles,
      farmHands: { bumpkins },
    };

    const state = unlockFarmhand({
      state: stateWith9Farmhands,
      action: { type: "farmHand.unlocked" },
    });

    expect(Object.keys(state.farmHands.bumpkins).length).toEqual(10);
    expect(state.farmHands.bumpkins[10].equipped).toEqual(FARMHANDS[9]);
  });
});
