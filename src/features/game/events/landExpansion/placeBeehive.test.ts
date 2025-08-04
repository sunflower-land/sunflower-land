import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { placeBeehive } from "./placeBeehive";

describe("placeBeehive", () => {
  it("throws an error if no beehives are available to be placed", () => {
    expect(() =>
      placeBeehive({
        state: {
          ...TEST_FARM,
          inventory: {
            Beehive: new Decimal(0),
          },
        },
        action: {
          id: "1234",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "beehive.placed",
        },
      }),
    ).toThrow("You do not have any available beehives");
  });

  it("places a beehive", () => {
    const state = placeBeehive({
      state: {
        ...TEST_FARM,
        inventory: {
          Beehive: new Decimal(1),
        },
      },
      action: {
        id: "1234",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "beehive.placed",
      },
    });

    expect(state.beehives["1234"]).toBeDefined();
    expect(state.beehives["1234"]).toMatchObject({
      x: 2,
      y: 2,
      honey: {
        updatedAt: expect.any(Number),
        produced: 0,
      },
      flowers: [],
    });
  });

  it("updates beehives", () => {
    const now = Date.now();

    const state = placeBeehive({
      state: {
        ...TEST_FARM,
        inventory: {
          Beehive: new Decimal(1),
        },
        flowers: {
          discovered: {},
          flowerBeds: {
            "123": {
              createdAt: now,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: now,
              },
            },
          },
        },
      },
      action: {
        id: "1234",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "beehive.placed",
      },
    });

    expect(state.beehives["1234"].flowers.length).toBe(1);
  });

  it("places an existing beehive", () => {
    const state = placeBeehive({
      state: {
        ...TEST_FARM,
        buildings: {},
        inventory: {
          Beehive: new Decimal(1),
        },
        beehives: {
          "1234": {
            swarm: false,
            honey: {
              updatedAt: 0,
              produced: 0,
            },
            flowers: [],
          },
        },
      },
      action: {
        id: "5656",
        coordinates: {
          x: 1,
          y: 1,
        },
        type: "beehive.placed",
      },
    });

    expect(state.beehives["1234"]).toMatchObject({
      x: 1,
      y: 1,
      honey: {
        updatedAt: expect.any(Number),
        produced: 0,
      },
      flowers: [],
    });
  });

  it("updates a removed beehive", () => {
    const now = Date.now();
    const state = placeBeehive({
      state: {
        ...TEST_FARM,
        buildings: {},
        inventory: {
          Beehive: new Decimal(1),
        },
        beehives: {
          "1234": {
            swarm: false,
            honey: {
              updatedAt: 0,
              produced: 0,
            },
            flowers: [],
          },
        },
        flowers: {
          flowerBeds: {
            "1234": {
              createdAt: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: now,
              },
              x: 1,
              y: 0,
            },
          },
          discovered: {},
        },
      },
      action: {
        id: "5656",
        coordinates: {
          x: 1,
          y: 1,
        },
        type: "beehive.placed",
      },
      createdAt: now,
    });

    expect(state.beehives["1234"]).toEqual({
      x: 1,
      y: 1,
      swarm: false,
      honey: {
        updatedAt: expect.any(Number),
        produced: 0,
      },
      flowers: [
        {
          id: "1234",
          attachedAt: now,
          attachedUntil: now + 24 * 60 * 60 * 1000,
          rate: 1,
        },
      ],
    });
  });
});
