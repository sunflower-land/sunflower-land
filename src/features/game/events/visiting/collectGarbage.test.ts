import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { collectGarbage } from "./collectGarbage";
import { GameState } from "features/game/types/game";

describe("collectGarbage", () => {
  const now = Date.now();

  it("doesn't add bonus Weed with Poseidon's Throne if not completed", () => {
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
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Poseidon's Throne": {
              cheers: 1999,
            },
          },
        },
      },
      action: { type: "garbage.collected", id: "1", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(visitorState.inventory.Weed).toEqual(new Decimal(1));
  });

  it("adds bonus Weed with Poseidon's Throne on the last weed collected", () => {
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
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Poseidon's Throne": {
              cheers: 2000,
            },
          },
        },
      },
      action: { type: "garbage.collected", id: "1", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(visitorState.inventory.Weed).toEqual(new Decimal(2));
  });

  it("does not add bonus Weed with Poseidon's Throne if not the last weed collected", () => {
    const [_, visitorState] = collectGarbage({
      state: {
        ...INITIAL_FARM,
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          clutter: {
            spawnedAt: now,
            locations: {
              "1": { type: "Weed", x: 0, y: 0 },
              "2": { type: "Weed", x: 0, y: 0 },
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
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Poseidon's Throne": {
              cheers: 2000,
            },
          },
        },
      },
      action: { type: "garbage.collected", id: "1", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(visitorState.inventory.Weed).toEqual(new Decimal(1));
  });

  it("adds bonus Dung with Poseidon's Throne on the last dung collected", () => {
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
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Poseidon's Throne": {
              cheers: 2000,
            },
          },
        },
      },
      action: { type: "garbage.collected", id: "1", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(visitorState.inventory.Dung).toEqual(new Decimal(2));
  });

  it("does not add bonus Dung with Poseidon's Throne if not the last dung collected", () => {
    const [_, visitorState] = collectGarbage({
      state: {
        ...INITIAL_FARM,
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          clutter: {
            spawnedAt: now,
            locations: {
              "1": { type: "Dung", x: 0, y: 0 },
              "2": { type: "Dung", x: 0, y: 0 },
              "3": { type: "Dung", x: 0, y: 0 },
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
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Poseidon's Throne": {
              cheers: 2000,
            },
          },
        },
      },
      action: { type: "garbage.collected", id: "1", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(visitorState.inventory.Dung).toEqual(new Decimal(1));
  });

  it("should net overall total of 3 Weed and 4 Dung with Poseidon's Throne", () => {
    let state: GameState = {
      ...INITIAL_FARM,
      socialFarming: {
        ...INITIAL_FARM.socialFarming,
        clutter: {
          spawnedAt: now,
          locations: {
            "1": { type: "Dung", x: 0, y: 0 },
            "2": { type: "Dung", x: 0, y: 0 },
            "3": { type: "Dung", x: 0, y: 0 },
            "4": { type: "Weed", x: 0, y: 0 },
            "5": { type: "Weed", x: 0, y: 0 },
          },
        },
      },
    };

    let visitorState: GameState = {
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
      socialFarming: {
        ...INITIAL_FARM.socialFarming,
        villageProjects: {
          "Poseidon's Throne": {
            cheers: 2000,
          },
        },
      },
    };
    [state, visitorState] = collectGarbage({
      state,
      visitorState,
      action: { type: "garbage.collected", id: "1", totalHelpedToday: 0 },
      createdAt: now,
    });
    expect(visitorState.inventory.Weed).toEqual(undefined);
    expect(visitorState.inventory.Dung).toEqual(new Decimal(1));
    [state, visitorState] = collectGarbage({
      state,
      visitorState,
      action: { type: "garbage.collected", id: "2", totalHelpedToday: 0 },
      createdAt: now,
    });
    expect(visitorState.inventory.Weed).toEqual(undefined);
    expect(visitorState.inventory.Dung).toEqual(new Decimal(2));
    [state, visitorState] = collectGarbage({
      state,
      visitorState,
      action: { type: "garbage.collected", id: "3", totalHelpedToday: 0 },
      createdAt: now,
    });
    expect(visitorState.inventory.Weed).toEqual(undefined);
    expect(visitorState.inventory.Dung).toEqual(new Decimal(4));
    [state, visitorState] = collectGarbage({
      state,
      visitorState,
      action: { type: "garbage.collected", id: "4", totalHelpedToday: 0 },
      createdAt: now,
    });
    expect(visitorState.inventory.Weed).toEqual(new Decimal(1));
    expect(visitorState.inventory.Dung).toEqual(new Decimal(4));
    [state, visitorState] = collectGarbage({
      state,
      visitorState,
      action: { type: "garbage.collected", id: "5", totalHelpedToday: 0 },
      createdAt: now,
    });
    expect(visitorState.inventory.Weed).toEqual(new Decimal(3));
    expect(visitorState.inventory.Dung).toEqual(new Decimal(4));
  });
});
