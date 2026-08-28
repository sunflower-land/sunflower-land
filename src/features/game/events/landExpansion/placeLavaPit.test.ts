import Decimal from "decimal.js-light";
import { placeLavaPit } from "./placeLavaPit";
import { INITIAL_FARM } from "features/game/lib/constants";
import { LAVA_PIT_TIME } from "./startLavaPit";

describe("placeLavaPit", () => {
  it("ensures lava pits are in inventory", () => {
    expect(() =>
      placeLavaPit({
        action: {
          name: "Lava Pit",
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          type: "lavaPit.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Lava Pit": new Decimal(0),
          },
        },
      }),
    ).toThrow("No lava pit available");
  });

  it("ensures lava pits are available", () => {
    expect(() =>
      placeLavaPit({
        action: {
          name: "Lava Pit",
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",

          type: "lavaPit.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Lava Pit": new Decimal(1),
          },
          lavaPits: {
            "123": {
              createdAt: Date.now(),
              x: 1,
              y: 1,
            },
          },
        },
      }),
    ).toThrow("No lava pit available");
  });

  it("ensures id does not exist", () => {
    expect(() =>
      placeLavaPit({
        action: {
          name: "Lava Pit",
          coordinates: {
            x: 2,
            y: 2,
          },
          id: "123",

          type: "lavaPit.placed",
        },
        state: {
          ...INITIAL_FARM,
          buildings: {},
          inventory: {
            "Lava Pit": new Decimal(2),
          },
          lavaPits: {
            "123": {
              createdAt: Date.now(),
              x: 0,
              y: 0,
            },
          },
        },
      }),
    ).toThrow("ID exists");
  });

  it("places a lava pit", () => {
    const state = placeLavaPit({
      action: {
        name: "Lava Pit",
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        type: "lavaPit.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Lava Pit": new Decimal(2),
        },
        lavaPits: {
          "123": {
            createdAt: Date.now(),
            x: 0,
            y: 0,
          },
        },
      },
    });

    expect(state.lavaPits).toEqual({
      "1": {
        createdAt: expect.any(Number),
        x: 2,
        y: 2,
      },
      "123": {
        createdAt: expect.any(Number),
        x: 0,
        y: 0,
      },
    });
  });

  it("reinstates current progress when lava pit was started", () => {
    const dateNow = Date.now();
    const state = placeLavaPit({
      action: {
        name: "Lava Pit",
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        type: "lavaPit.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Lava Pit": new Decimal(2),
        },
        lavaPits: {
          "123": {
            createdAt: dateNow,
            startedAt: dateNow - 180000,
            readyAt: dateNow - 180000 + 72 * 60 * 60 * 1000,
            removedAt: dateNow - 120000,
          },
        },
      },
      createdAt: dateNow,
    });

    expect(state.lavaPits).toEqual({
      "123": {
        createdAt: expect.any(Number),
        startedAt: dateNow - 60000,
        readyAt: dateNow - 60000 + 72 * 60 * 60 * 1000,
        x: 2,
        y: 2,
      },
    });
  });

  it("does not re-price an in-flight burn with a boost equipped after it started", () => {
    const dateNow = Date.now();
    const startedAt = dateNow - 60 * 60 * 1000;
    const readyAt = startedAt + LAVA_PIT_TIME;
    const removedAt = dateNow - 30 * 60 * 1000;

    const state = placeLavaPit({
      action: {
        name: "Lava Pit",
        coordinates: { x: 2, y: 2 },
        id: "1",
        type: "lavaPit.placed",
      },
      state: {
        ...INITIAL_FARM,
        // Obsidian Necklace halves the burn, but it was equipped AFTER the pit
        // was started - the duration is a snapshot, not a live lookup.
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            necklace: "Obsidian Necklace",
          },
        },
        buildings: {},
        inventory: {
          "Lava Pit": new Decimal(2),
        },
        lavaPits: {
          "123": {
            createdAt: startedAt,
            startedAt,
            readyAt,
            removedAt,
          },
        },
      },
      createdAt: dateNow,
    });

    const downtime = dateNow - removedAt;

    expect(state.lavaPits["123"].startedAt).toEqual(startedAt + downtime);
    expect(state.lavaPits["123"].readyAt).toEqual(readyAt + downtime);
  });

  it("pauses a burn that has no stored readyAt without inventing one", () => {
    const dateNow = Date.now();
    const startedAt = dateNow - 60 * 60 * 1000;
    const removedAt = dateNow - 30 * 60 * 1000;

    const state = placeLavaPit({
      action: {
        name: "Lava Pit",
        coordinates: { x: 2, y: 2 },
        id: "1",
        type: "lavaPit.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Lava Pit": new Decimal(2),
        },
        lavaPits: {
          "123": { createdAt: startedAt, startedAt, removedAt },
        },
      },
      createdAt: dateNow,
    });

    expect(state.lavaPits["123"].startedAt).toEqual(
      startedAt + (dateNow - removedAt),
    );
    expect(state.lavaPits["123"].readyAt).toBeUndefined();
  });
});
