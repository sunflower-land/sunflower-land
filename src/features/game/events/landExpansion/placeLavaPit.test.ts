import Decimal from "decimal.js-light";
import { placeLavaPit } from "./placeLavaPit";
import { INITIAL_FARM } from "features/game/lib/constants";

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
});
