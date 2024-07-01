import { GameState } from "features/game/types/game";
import { accelerateComposter } from "./accelerateComposter";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { composterDetails } from "features/game/types/composters";

const GAME_STATE: GameState = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

describe("accelerateComposter", () => {
  it("requires building exists", () => {
    expect(() =>
      accelerateComposter({
        state: {
          ...GAME_STATE,
          buildings: {},
        },
        action: {
          type: "compost.accelerated",
          building: "Compost Bin",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Composter does not exist");
  });

  it("requires compost is producing", () => {
    expect(() =>
      accelerateComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Compost Bin": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 10000000,
                id: "123",
                readyAt: 10000000,
              },
            ],
          },
        },
        action: {
          type: "compost.accelerated",
          building: "Compost Bin",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Composter is not producing");
  });

  it("requires compost is not complete", () => {
    expect(() =>
      accelerateComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Compost Bin": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 10000000,
                id: "123",
                readyAt: 10000000,
                producing: {
                  items: {},
                  readyAt: Date.now() - 500,
                  startedAt: Date.now() - 500000,
                },
              },
            ],
          },
        },
        action: {
          type: "compost.accelerated",
          building: "Compost Bin",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Composter already done");
  });

  it("requires player has eggs", () => {
    expect(() =>
      accelerateComposter({
        state: {
          ...GAME_STATE,
          inventory: {
            Egg: new Decimal(9),
          },
          buildings: {
            "Compost Bin": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 10000000,
                id: "123",
                readyAt: 10000000,
                producing: {
                  items: {},
                  readyAt: Date.now() + 50000,
                  startedAt: Date.now() - 500000,
                },
              },
            ],
          },
        },
        action: {
          type: "compost.accelerated",
          building: "Compost Bin",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Missing Eggs");
  });

  it("does not double boost compost", () => {
    const readyAt =
      Date.now() + composterDetails["Compost Bin"].timeToFinishMilliseconds;

    const state = accelerateComposter({
      state: {
        ...GAME_STATE,
        inventory: { Egg: new Decimal(23) },
        buildings: {
          "Compost Bin": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 10000000,
              id: "123",
              readyAt: 10000000,
              producing: {
                items: {},
                readyAt,
                startedAt: Date.now() - 500000,
              },
            },
          ],
        },
      },
      action: {
        type: "compost.accelerated",
        building: "Compost Bin",
      },
      createdAt: Date.now(),
    });

    expect(() =>
      accelerateComposter({
        state,
        action: {
          type: "compost.accelerated",
          building: "Compost Bin",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Already boosted");
  });

  it("accelerates Compost Bin", () => {
    const readyAt =
      Date.now() + composterDetails["Compost Bin"].timeToFinishMilliseconds;
    const state = accelerateComposter({
      state: {
        ...GAME_STATE,
        inventory: { Egg: new Decimal(13) },
        buildings: {
          "Compost Bin": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 10000000,
              id: "123",
              readyAt: 10000000,
              producing: {
                items: {},
                readyAt,
                startedAt: Date.now() - 500000,
              },
            },
          ],
        },
      },
      action: {
        type: "compost.accelerated",
        building: "Compost Bin",
      },
      createdAt: Date.now(),
    });

    expect(state.inventory.Egg).toEqual(new Decimal(3));
    expect(state.buildings["Compost Bin"]?.[0].producing?.readyAt).toEqual(
      readyAt - 2 * 60 * 60 * 1000,
    );
  });

  it("accelerates Turbo Composter", () => {
    const readyAt =
      Date.now() + composterDetails["Turbo Composter"].timeToFinishMilliseconds;
    const state = accelerateComposter({
      state: {
        ...GAME_STATE,
        inventory: { Egg: new Decimal(25) },
        buildings: {
          "Turbo Composter": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 10000000,
              id: "123",
              readyAt: 10000000,
              producing: {
                items: {},
                readyAt,
                startedAt: Date.now() - 500000,
              },
            },
          ],
        },
      },
      action: {
        type: "compost.accelerated",
        building: "Turbo Composter",
      },
      createdAt: Date.now(),
    });

    expect(state.inventory.Egg).toEqual(new Decimal(5));
    expect(state.buildings["Turbo Composter"]?.[0].producing?.readyAt).toEqual(
      readyAt - 3 * 60 * 60 * 1000,
    );
  });
  it("accelerates Premium Composter", () => {
    const readyAt =
      Date.now() +
      composterDetails["Premium Composter"].timeToFinishMilliseconds;

    const state = accelerateComposter({
      state: {
        ...GAME_STATE,
        inventory: { Egg: new Decimal(33) },
        buildings: {
          "Premium Composter": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 10000000,
              id: "123",
              readyAt: 10000000,
              producing: {
                items: {},
                readyAt,
                startedAt: Date.now() - 500000,
              },
            },
          ],
        },
      },
      action: {
        type: "compost.accelerated",
        building: "Premium Composter",
      },
      createdAt: Date.now(),
    });

    expect(state.inventory.Egg).toEqual(new Decimal(3));
    expect(
      state.buildings["Premium Composter"]?.[0].producing?.readyAt,
    ).toEqual(readyAt - 4 * 60 * 60 * 1000);
  });
});
