import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { collectGarbage } from "./collectGarbage";

describe("collectGarbage", () => {
  const now = Date.now();

  it("adds bonus Weed with Poseidon's Throne", () => {
    const [_, visitorState] = collectGarbage({
      state: {
        ...INITIAL_FARM,
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          clutter: {
            spawnedAt: now,
            locations: {
              "1": { type: "Weed", x: 0, y: 0 },
            },
          },
        },
      },
      visitorState: {
        ...INITIAL_FARM,
        collectibles: {
          "Poseidon's Throne": [
            {
              id: "throne",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
      },
      action: { type: "garbage.collected", id: "1", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(visitorState.inventory.Weed).toEqual(new Decimal(2));
  });

  it("adds bonus Dung with Poseidon's Throne", () => {
    const [_, visitorState] = collectGarbage({
      state: {
        ...INITIAL_FARM,
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          clutter: {
            spawnedAt: now,
            locations: {
              "1": { type: "Dung", x: 0, y: 0 },
            },
          },
        },
      },
      visitorState: {
        ...INITIAL_FARM,
        collectibles: {
          "Poseidon's Throne": [
            {
              id: "throne",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
      },
      action: { type: "garbage.collected", id: "1", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(visitorState.inventory.Dung).toEqual(new Decimal(2));
  });
});
