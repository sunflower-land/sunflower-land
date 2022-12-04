import Decimal from "decimal.js-light";
import { LEVEL_BRACKETS } from "features/game/lib/level";
import { BUILDINGS } from "features/game/types/buildings";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import {
  constructBuilding,
  CONSTRUCT_BUILDING_ERRORS,
} from "./constructBuilding";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  inventory: {},
  buildings: {},
};

const waterWell = BUILDINGS()["Water Well"];

const dateNow = Date.now();

describe("Construct building", () => {
  it("does not construct without bumpkin", () => {
    expect(() =>
      constructBuilding({
        state: { ...GAME_STATE, bumpkin: undefined },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Water Well",
          coordinates: {
            x: 2,
            y: 2,
          },
        },
      })
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.NO_BUMPKIN);
  });
  it("does not construct if build level is not reached", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...GAME_STATE.bumpkin!,
            experience: LEVEL_BRACKETS[1],
          },
        },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Water Well",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.MAX_BUILDINGS_REACHED);
  });
  it("does not construct if max building limit is reached", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...GAME_STATE.bumpkin!,
            experience: LEVEL_BRACKETS[20],
          },
          inventory: {
            "Water Well": new Decimal(4),
          },
          buildings: {
            "Water Well": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: Date.now(),
                readyAt: Date.now() + 30 * 1000,
                id: "1",
              },
              {
                coordinates: { x: 3, y: 3 },
                createdAt: Date.now(),
                readyAt: Date.now() + 30 * 1000,
                id: "2",
              },
              {
                coordinates: { x: 1, y: 3 },
                createdAt: Date.now(),
                readyAt: Date.now() + 30 * 1000,
                id: "3",
              },
              {
                coordinates: { x: 3, y: 1 },
                createdAt: Date.now(),
                readyAt: Date.now() + 30 * 1000,
                id: "4",
              },
            ],
          },
        },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Water Well",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.MAX_BUILDINGS_REACHED);
  });
  it("does not construct if not enough SFL", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...GAME_STATE.bumpkin!,
            experience: LEVEL_BRACKETS[20],
          },
          inventory: {
            Wood: new Decimal(100),
            Stone: new Decimal(100),
          },
          balance: new Decimal(0),
        },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Water Well",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow(CONSTRUCT_BUILDING_ERRORS.NOT_ENOUGH_SFL);
  });
  it("does not construct if not enough ingredients", () => {
    expect(() =>
      constructBuilding({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...GAME_STATE.bumpkin!,
            experience: LEVEL_BRACKETS[20],
          },
          inventory: {
            Wood: new Decimal(0.1),
            Stone: new Decimal(0.1),
          },
          balance: new Decimal(100),
        },
        action: {
          id: "123",
          type: "building.constructed",
          name: "Water Well",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow(`${CONSTRUCT_BUILDING_ERRORS.NOT_ENOUGH_INGREDIENTS}Wood, Stone`);
  });
  it("crafts item with sufficient ingredients and SFL", () => {
    const initialWood = new Decimal(100);
    const initialStone = new Decimal(101);
    const initialSFL = new Decimal(42);
    const initialWishingWell = new Decimal(0.2);
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin!,
          experience: LEVEL_BRACKETS[20],
        },
        inventory: {
          Wood: initialWood,
          Stone: initialStone,
          "Water Well": initialWishingWell,
        },
        balance: initialSFL,
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Water Well",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    });

    expect(state.inventory["Water Well"]).toEqual(initialWishingWell.add(1));
    expect(state.buildings["Water Well"]?.length).toEqual(1);

    const woodRequirements = waterWell.ingredients.find(
      (x) => x.item === "Wood"
    )?.amount;
    const stoneRequirements = waterWell.ingredients.find(
      (x) => x.item === "Stone"
    )?.amount;
    expect(state.inventory.Wood).toEqual(initialWood.minus(woodRequirements!));
    expect(state.inventory.Stone).toEqual(
      initialStone.minus(stoneRequirements!)
    );
    expect(state.balance).toEqual(initialSFL.minus(waterWell.sfl));
  });
  it("does not affect existing inventory", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        inventory: {
          Wood: new Decimal(100),
          Stone: new Decimal(100),
          Radish: new Decimal(50),
        },
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Fire Pit",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    });

    expect(state.inventory["Fire Pit"]).toEqual(new Decimal(1));
    expect(state.inventory["Radish"]).toEqual(new Decimal(50));
  });
  it("adds the building to the buildings data structure correctly", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        balance: new Decimal(100),
        buildings: {},
        inventory: { Wood: new Decimal(20), Stone: new Decimal(100) },
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Fire Pit",
        coordinates: {
          x: 1,
          y: 2,
        },
      },
      createdAt: dateNow,
    });

    expect(state.buildings["Fire Pit"]).toHaveLength(1);
    expect(state.buildings["Fire Pit"]?.[0]).toEqual({
      id: expect.any(String),
      coordinates: { x: 1, y: 2 },
      readyAt: dateNow + 30 * 1000,
      createdAt: dateNow,
    });
  });
  it("constructs multiple Water Wells", () => {
    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        balance: new Decimal(100),
        bumpkin: {
          ...GAME_STATE.bumpkin!,
          experience: LEVEL_BRACKETS[20],
        },
        inventory: {
          Wood: new Decimal(20),
          Stone: new Decimal(15),
          "Water Well": new Decimal(1),
        },
        buildings: {
          "Water Well": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: Date.now(),
              readyAt: Date.now() + 30 * 1000,
              id: "1",
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Water Well",
        coordinates: {
          x: 1,
          y: 2,
        },
      },
      createdAt: 234567890,
    });
    expect(state.buildings["Water Well"]).toHaveLength(2);
  });

  it("does not affect existing Buildings when constructing new Water Well", () => {
    const buildings = {
      "Water Well": [
        {
          coordinates: { x: 1, y: 1 },
          createdAt: dateNow,
          readyAt: dateNow + 30 * 1000,
          id: "1",
        },
      ],
      Workbench: [
        {
          coordinates: { x: 2, y: 2 },
          createdAt: dateNow,
          readyAt: dateNow + 5 * 60 * 1000,
          id: "2",
        },
      ],
    };

    const state = constructBuilding({
      state: {
        ...GAME_STATE,
        balance: new Decimal(100),
        bumpkin: {
          ...GAME_STATE.bumpkin!,
          experience: LEVEL_BRACKETS[20],
        },
        inventory: {
          Wood: new Decimal(20),
          Stone: new Decimal(15),
        },
        buildings: {
          ...buildings,
        },
      },
      action: {
        id: "123",
        type: "building.constructed",
        name: "Water Well",
        coordinates: {
          x: 1,
          y: 2,
        },
      },
      createdAt: dateNow,
    });
    expect(state.buildings).toEqual({
      "Water Well": [
        {
          coordinates: { x: 1, y: 1 },
          createdAt: dateNow,
          readyAt: dateNow + 30 * 1000,
          id: "1",
        },
        {
          id: "123",
          coordinates: {
            x: 1,
            y: 2,
          },
          createdAt: dateNow,
          readyAt: dateNow + waterWell.constructionSeconds * 1000,
        },
      ],
      Workbench: [
        {
          coordinates: { x: 2, y: 2 },
          createdAt: dateNow,
          readyAt: dateNow + 5 * 60 * 1000,
          id: "2",
        },
      ],
    });
  });
});
