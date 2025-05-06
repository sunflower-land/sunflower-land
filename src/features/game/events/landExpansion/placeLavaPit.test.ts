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

  it("ensures lava pits do not collide", () => {
    expect(() =>
      placeLavaPit({
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
              x: 2,
              y: 2,
            },
          },
        },
      }),
    ).toThrow("Lava Pit collides");
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
});
