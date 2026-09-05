import Decimal from "decimal.js-light";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { INITIAL_BUMPKIN, TEST_FARM } from "../../lib/constants";
import { createInitialAgingShed } from "../../lib/agingShed";
import type { BuildingProduct, GameState } from "../../types/game";
import { getAnimalReadyAt } from "../../lib/animals";
import { getNextLoveAvailableAt, isAnimalNeedingLove } from "./loveAnimal";
import { placeBuilding } from "./placeBuilding";
import { RECIPES } from "features/game/lib/crafting";
import { getCookingQueueReadyAts } from "features/game/lib/cookingReadiness";
import { getExpiryCooldown } from "features/game/lib/collectibleBuilt";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  inventory: {},
  buildings: {},
};

const dateNow = Date.now();

describe("Place building", () => {
  const farmId = 1;
  it("places a building", () => {
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[20],
        },
        inventory: {
          "Water Well": new Decimal(1),
        },
        buildings: {},
      },

      action: {
        id: "123",
        type: "building.placed",
        name: "Water Well",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    });

    expect(state.buildings["Water Well"]).toHaveLength(1);
  });

  it("places multiple buildings", () => {
    const state = {
      ...GAME_STATE,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[20],
      },
      inventory: {
        "Water Well": new Decimal(2),
      },
      buildings: {
        "Water Well": [
          {
            id: "123",
            coordinates: { x: 1, y: 1 },
            createdAt: dateNow,
            readyAt: dateNow,
          },
        ],
      },
    };

    const newState = placeBuilding({
      farmId,
      state,
      createdAt: dateNow,
      action: {
        id: "456",
        type: "building.placed",
        name: "Water Well",
        coordinates: {
          x: 0,
          y: 0,
        },
      },
    });

    expect(newState.buildings["Water Well"]).toHaveLength(2);
    expect(newState.buildings["Water Well"]?.[0]).toEqual({
      id: expect.any(String),
      coordinates: { x: 1, y: 1 },
      readyAt: dateNow,
      createdAt: dateNow,
    });
    expect(newState.buildings["Water Well"]?.[1]).toEqual({
      id: expect.any(String),
      coordinates: { x: 0, y: 0 },
      readyAt: dateNow,
      createdAt: dateNow,
    });
  });

  it("adjusts the new readyAt for cooking buildings", () => {
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Fire Pit": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Fire Pit": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              // Lifted 50s ago; every recipe moves out by that downtime.
              removedAt: dateNow - 50000,
              crafting: [
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 10000,
                },
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 70000,
                },
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 130000,
                },
                {
                  name: "Pizza Margherita",
                  readyAt: dateNow + 190000,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "building.placed",
        name: "Fire Pit",
        id: "123",
        coordinates: { x: 1, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.buildings["Fire Pit"]?.[0].crafting?.[0].readyAt).toEqual(
      dateNow + 60000,
    );
    expect(state.buildings["Fire Pit"]?.[0].crafting?.[1].readyAt).toEqual(
      dateNow + 120000,
    );
    expect(state.buildings["Fire Pit"]?.[0].crafting?.[2].readyAt).toEqual(
      dateNow + 180000,
    );
    expect(state.buildings["Fire Pit"]?.[0].crafting?.[3].readyAt).toEqual(
      dateNow + 240000,
    );
    expect(state.buildings["Fire Pit"]?.[0].coordinates).toEqual({
      x: 1,
      y: 1,
    });
  });

  it("adjusts the new readyAt for composters", () => {
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Premium Composter": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Premium Composter": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
              producing: {
                items: {
                  "Rapid Root": 10,
                  "Red Wiggler": 1,
                },
                startedAt: dateNow - 180000,
                readyAt: dateNow - 180000 + 12 * 60 * 60 * 1000,
              },
            },
          ],
        },
      },
      action: {
        type: "building.placed",
        name: "Premium Composter",
        id: "123",
        coordinates: { x: 1, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(
      state.buildings["Premium Composter"]?.[0].producing?.startedAt,
    ).toEqual(dateNow - 60000);
    expect(
      state.buildings["Premium Composter"]?.[0].producing?.readyAt,
    ).toEqual(dateNow - 60000 + 12 * 60 * 60 * 1000);
  });

  it("does not re-price an in-flight compost with a boost placed after it started", () => {
    const startedAt = dateNow - 60 * 60 * 1000;
    const readyAt = startedAt + 12 * 60 * 60 * 1000;
    const removedAt = dateNow - 30 * 60 * 1000;

    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Premium Composter": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        // Soil Krabby takes 10% off a compost, but it was placed AFTER this
        // batch started - the duration is a snapshot, not a live lookup.
        collectibles: {
          "Soil Krabby": [
            {
              id: "krabby",
              createdAt: dateNow,
              coordinates: { x: 5, y: 5 },
              readyAt: dateNow,
            },
          ],
        },
        buildings: {
          "Premium Composter": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt,
              producing: {
                items: { "Rapid Root": 10 },
                startedAt,
                readyAt,
              },
            },
          ],
        },
      },
      action: {
        type: "building.placed",
        name: "Premium Composter",
        id: "123",
        coordinates: { x: 1, y: 1 },
      },
      createdAt: dateNow,
    });

    const downtime = dateNow - removedAt;
    const producing = state.buildings["Premium Composter"]?.[0].producing;

    expect(producing?.startedAt).toEqual(startedAt + downtime);
    expect(producing?.readyAt).toEqual(readyAt + downtime);
  });

  describe("cooking queues", () => {
    const MIN = 60 * 1000;

    const firePit = (
      crafting: BuildingProduct[],
      removedAt: number,
    ): GameState["buildings"] => ({
      "Fire Pit": [
        {
          id: "123",
          createdAt: dateNow - 24 * 60 * MIN,
          readyAt: dateNow - 24 * 60 * MIN,
          removedAt,
          crafting,
        },
      ],
    });

    const place = (state: GameState) =>
      placeBuilding({
        farmId,
        state,
        action: {
          type: "building.placed",
          name: "Fire Pit",
          id: "123",
          coordinates: { x: 1, y: 1 },
        },
        createdAt: dateNow,
      });

    it("pauses a windowed queue across a lift", () => {
      const startedAt = dateNow - 20 * MIN;
      const removedAt = dateNow - 10 * MIN;
      const downtime = dateNow - removedAt;

      const state = place({
        ...GAME_STATE,
        inventory: { "Fire Pit": new Decimal(1) },
        buildings: firePit(
          [
            {
              id: "a",
              name: "Boiled Eggs",
              startedAt,
              baseDurationMs: 60 * MIN,
              readyAt: startedAt + 60 * MIN,
            },
            {
              id: "b",
              name: "Boiled Eggs",
              baseDurationMs: 30 * MIN,
              readyAt: startedAt + 90 * MIN,
            },
          ],
          removedAt,
        ),
      });

      const crafting = state.buildings["Fire Pit"]![0].crafting!;
      const readyAts = getCookingQueueReadyAts({ crafting, game: state });

      // Both recipes move out by exactly the time the building spent unplaced.
      expect(readyAts[0]).toEqual(startedAt + 60 * MIN + downtime);
      expect(readyAts[1]).toEqual(startedAt + 90 * MIN + downtime);
      // ...and the persisted cache agrees with the derived chain again.
      expect(crafting[0].readyAt).toEqual(readyAts[0]);
      expect(crafting[1].readyAt).toEqual(readyAts[1]);
    });

    it("pauses a legacy queue across a lift", () => {
      const removedAt = dateNow - 10 * MIN;
      const downtime = dateNow - removedAt;

      const state = place({
        ...GAME_STATE,
        inventory: { "Fire Pit": new Decimal(1) },
        buildings: firePit(
          [
            { name: "Boiled Eggs", readyAt: dateNow + 40 * MIN },
            { name: "Boiled Eggs", readyAt: dateNow + 70 * MIN },
          ],
          removedAt,
        ),
      });

      const crafting = state.buildings["Fire Pit"]![0].crafting!;

      expect(crafting[0].readyAt).toEqual(dateNow + 40 * MIN + downtime);
      expect(crafting[1].readyAt).toEqual(dateNow + 70 * MIN + downtime);
      expect(crafting[0].timeRemaining).toBeUndefined();
    });

    it("keeps boost credit earned before the lift when the window expires during it", () => {
      // 60m of work. A 2x hourglass covers the first 15m, so 30m of work is
      // banked; the window then expires while the building sits unplaced.
      const start = dateNow - 45 * MIN;
      const removedAt = start + 15 * MIN;

      const base: GameState = {
        ...GAME_STATE,
        inventory: { "Fire Pit": new Decimal(1) },
      };
      const cooldown = getExpiryCooldown("Gourmet Hourglass", base);

      const state = place({
        ...base,
        collectibles: {
          "Gourmet Hourglass": [
            {
              id: "hourglass",
              // Expires exactly when the building is lifted.
              createdAt: removedAt - cooldown,
              readyAt: removedAt - cooldown,
              coordinates: { x: 5, y: 5 },
            },
          ],
        },
        buildings: firePit(
          [
            {
              id: "a",
              name: "Boiled Eggs",
              startedAt: start,
              baseDurationMs: 60 * MIN,
              readyAt: start + 45 * MIN,
            },
          ],
          removedAt,
        ),
      });

      const crafting = state.buildings["Fire Pit"]![0].crafting!;

      // 30m of work banked, 30m left, resumed unboosted from the moment it was
      // placed. Shifting the timeline instead would have stranded the window
      // before the new start and lost that credit (dateNow + 45m).
      expect(crafting[0].baseDurationMs).toEqual(30 * MIN);
      expect(getCookingQueueReadyAts({ crafting, game: state })[0]).toEqual(
        dateNow + 30 * MIN,
      );
    });
  });

  it("adjusts the new readyAt for crop machines", () => {
    const startTime = dateNow - 20000000;
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Crop Machine": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              queue: [
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 0,
                  totalGrowTime: 60000000,
                  startTime: startTime,
                  readyAt: startTime + 60000000,
                  pausedTimeRemaining: 50000000,
                },
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 0,
                  totalGrowTime: 60000000,
                  startTime: startTime + 60000000,
                  readyAt: startTime + 120000000,
                  pausedTimeRemaining: 110000000,
                },
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 0,
                  totalGrowTime: 60000000,
                  startTime: startTime + 120000000,
                  readyAt: startTime + 180000000,
                  pausedTimeRemaining: 170000000,
                },
                {
                  crop: "Sunflower",
                  seeds: 1000,
                  growTimeRemaining: 30000000,
                  totalGrowTime: 60000000,
                  startTime: startTime + 180000000,
                  growsUntil: startTime + 210000000,
                  pausedTimeRemaining: 200000000,
                },
              ],
            },
          ],
        },
      },
      action: {
        type: "building.placed",
        name: "Crop Machine",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.buildings["Crop Machine"]?.[0].queue?.[0].readyAt).toEqual(
      dateNow + 50000000,
    );
    expect(state.buildings["Crop Machine"]?.[0].queue?.[1].readyAt).toEqual(
      dateNow + 110000000,
    );
    expect(state.buildings["Crop Machine"]?.[0].queue?.[2].readyAt).toEqual(
      dateNow + 170000000,
    );
    expect(state.buildings["Crop Machine"]?.[0].queue?.[3].growsUntil).toEqual(
      dateNow + 200000000,
    );
  });

  it("adjusts the new readyAt for greenhouse", () => {
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          Greenhouse: new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          Greenhouse: [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
            },
          ],
        },
        greenhouse: {
          oil: 100,
          pots: {
            "123": {
              plant: {
                name: "Olive",
                plantedAt: dateNow - 180000,
              },
            },
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Greenhouse",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.greenhouse.pots["123"].plant?.plantedAt).toEqual(
      dateNow - 60000,
    );
  });

  it("banks accrued work for windowed greenhouse plants on move", () => {
    // Windowed plant sown 5 minutes before placement; the building was picked
    // up 2 minutes ago, so it grew 3 minutes — with a Tortoise Shrine (1.5×)
    // active the whole time, that is 270s of accrued work.
    const plantedAt = dateNow - 300000;
    const removedAt = dateNow - 120000;
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          Greenhouse: new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        collectibles: {
          "Tortoise Shrine": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: plantedAt,
              readyAt: plantedAt,
            },
          ],
        },
        buildings: {
          Greenhouse: [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt,
            },
          ],
        },
        greenhouse: {
          oil: 100,
          pots: {
            "123": {
              plant: {
                name: "Olive",
                plantedAt,
                baseDurationMs: 158400000,
              },
            },
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Greenhouse",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    const plant = state.greenhouse.pots["123"].plant;
    // 180s wall-clock at 1.5× = 270s of banked work; the remaining work
    // resumes from placement time against the live windows.
    expect(plant?.boostedTime).toEqual(270000);
    expect(plant?.baseDurationMs).toEqual(158400000 - 270000);
    expect(plant?.plantedAt).toEqual(dateNow);
  });

  it("adjusts the new readyAt for henhouse", () => {
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Basic Land": new Decimal(10),
          "Hen House": new Decimal(1),
        },
        buildings: {
          "Hen House": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
            },
          ],
        },
        henHouse: {
          level: 1,
          animals: {
            "123": {
              type: "Chicken",
              id: "123",
              state: "idle",
              createdAt: dateNow - 180000,
              experience: 1000,
              asleepAt: dateNow - 180000,
              awakeAt: dateNow - 180000 + 24 * 60 * 60 * 1000,
              lovedAt: 0,
              item: "Brush",
            },
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Hen House",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.henHouse.animals["123"].asleepAt).toEqual(dateNow - 60000);
    expect(state.henHouse.animals["123"].awakeAt).toEqual(
      dateNow - 60000 + 24 * 60 * 60 * 1000,
    );
  });

  it("adjusts the new lovedAt for henhouse", () => {
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Basic Land": new Decimal(10),
          "Hen House": new Decimal(1),
        },
        buildings: {
          "Hen House": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
            },
          ],
        },
        henHouse: {
          level: 1,
          animals: {
            "123": {
              type: "Chicken",
              id: "123",
              state: "idle",
              createdAt: dateNow - 180000,
              experience: 1000,
              asleepAt: dateNow - 180000,
              awakeAt: dateNow - 180000 + 24 * 60 * 60 * 1000,
              lovedAt: dateNow - 160000,
              item: "Brush",
            },
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Hen House",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.henHouse.animals["123"].lovedAt).toEqual(
      dateNow - (160000 - 120000),
    );
  });

  it("adjusts the new readyAt for crafting box", () => {
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Crafting Box": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Crafting Box": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
            },
          ],
        },
        craftingBox: {
          status: "crafting",
          queue: [
            {
              id: "doll-1",
              name: "Doll",
              startedAt: dateNow - 180000,
              readyAt: dateNow - 180000 + (RECIPES["Doll"]?.time ?? 0),
              type: "collectible",
            },
          ],
          recipes: {},
        },
      },
      action: {
        type: "building.placed",
        name: "Crafting Box",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.craftingBox.queue?.[0].startedAt).toEqual(dateNow - 60000);
    expect(state.craftingBox.queue?.[0].readyAt).toEqual(
      dateNow - 60000 + (RECIPES["Doll"]?.time ?? 0),
    );
  });

  it("shifts all crafting box queue items by downtime when re-placing", () => {
    const dollTime = RECIPES["Doll"]?.time ?? 0;
    const timberTime = RECIPES["Timber"]?.time ?? 0;
    const removedAt = dateNow - 120000;
    const dollStartedAt = dateNow - 180000;
    const dollReadyAt = dollStartedAt + dollTime;
    const timberStartedAt = dollReadyAt;
    const timberReadyAt = timberStartedAt + timberTime;

    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Crafting Box": new Decimal(1),
          "Basic Land": new Decimal(10),
          Leather: new Decimal(20),
          Wood: new Decimal(20),
        },
        buildings: {
          "Crafting Box": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt,
            },
          ],
        },
        craftingBox: {
          status: "crafting",
          queue: [
            {
              id: "doll-1",
              name: "Doll",
              startedAt: dollStartedAt,
              readyAt: dollReadyAt,
              type: "collectible",
            },
            {
              id: "timber-1",
              name: "Timber",
              startedAt: timberStartedAt,
              readyAt: timberReadyAt,
              type: "collectible",
            },
          ],
          recipes: {},
        },
      },
      action: {
        type: "building.placed",
        name: "Crafting Box",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    const downtimeDelta = dateNow - removedAt;
    expect(state.craftingBox.queue).toHaveLength(2);
    expect(state.craftingBox.queue?.[0].startedAt).toEqual(
      dollStartedAt + downtimeDelta,
    );
    expect(state.craftingBox.queue?.[0].readyAt).toEqual(
      dollReadyAt + downtimeDelta,
    );
    expect(state.craftingBox.queue?.[1].startedAt).toEqual(
      timberStartedAt + downtimeDelta,
    );
    expect(state.craftingBox.queue?.[1].readyAt).toEqual(
      timberReadyAt + downtimeDelta,
    );
  });

  it("does not adjust crafting box when queue is empty", () => {
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Crafting Box": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Crafting Box": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
            },
          ],
        },
        craftingBox: {
          status: "idle",
          queue: [],
          recipes: {},
        },
      },
      action: {
        type: "building.placed",
        name: "Crafting Box",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    expect(state.craftingBox.queue).toEqual([]);
    expect(state.craftingBox.status).toBe("idle");
  });

  it("shifts aging shed fermentation jobs and upgradeReadyAt by downtime when re-placing", () => {
    const removedAt = dateNow - 120000;
    const jobStartedAt = dateNow - 180000;
    const jobReadyAt = dateNow + 60 * 60 * 1000;
    const upgradeReadyAt = dateNow + 500000;

    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Aging Shed": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Aging Shed": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt,
            },
          ],
        },
        agingShed: {
          ...createInitialAgingShed(),
          level: 1,
          upgradeReadyAt,
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "job-1",
                recipe: "Pickled Radish",
                startedAt: jobStartedAt,
                readyAt: jobReadyAt,
              },
            ],
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Aging Shed",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    const downtimeDelta = dateNow - removedAt;
    expect(state.agingShed.racks.fermentation).toHaveLength(1);
    expect(state.agingShed.racks.fermentation[0].startedAt).toEqual(
      jobStartedAt + downtimeDelta,
    );
    expect(state.agingShed.racks.fermentation[0].readyAt).toEqual(
      jobReadyAt + downtimeDelta,
    );
    expect(state.agingShed.upgradeReadyAt).toEqual(
      upgradeReadyAt + downtimeDelta,
    );
  });

  it("shifts aging shed aging rack slots by downtime when re-placing", () => {
    const removedAt = dateNow - 120000;
    const slotStartedAt = dateNow - 180000;
    const slotReadyAt = dateNow + 60 * 60 * 1000;

    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Aging Shed": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Aging Shed": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt,
            },
          ],
        },
        agingShed: {
          ...createInitialAgingShed(),
          level: 1,
          racks: {
            ...createInitialAgingShed().racks,
            aging: [
              {
                id: "slot-1",
                fish: "Anchovy",
                startedAt: slotStartedAt,
                readyAt: slotReadyAt,
              },
            ],
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Aging Shed",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    const downtimeDelta = dateNow - removedAt;
    expect(state.agingShed.racks.aging).toHaveLength(1);
    expect(state.agingShed.racks.aging[0].startedAt).toEqual(
      slotStartedAt + downtimeDelta,
    );
    expect(state.agingShed.racks.aging[0].readyAt).toEqual(
      slotReadyAt + downtimeDelta,
    );
  });

  it("shifts aging shed spice rack jobs by downtime when re-placing", () => {
    const removedAt = dateNow - 120000;
    const jobStartedAt = dateNow - 180000;
    const jobReadyAt = dateNow + 60 * 60 * 1000;

    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Aging Shed": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Aging Shed": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt,
            },
          ],
        },
        agingShed: {
          ...createInitialAgingShed(),
          level: 1,
          racks: {
            ...createInitialAgingShed().racks,
            spice: [
              {
                id: "spice-1",
                recipe: "Refined Salt",
                startedAt: jobStartedAt,
                readyAt: jobReadyAt,
              },
            ],
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Aging Shed",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    const downtimeDelta = dateNow - removedAt;
    expect(state.agingShed.racks.spice).toHaveLength(1);
    expect(state.agingShed.racks.spice[0].startedAt).toEqual(
      jobStartedAt + downtimeDelta,
    );
    expect(state.agingShed.racks.spice[0].readyAt).toEqual(
      jobReadyAt + downtimeDelta,
    );
  });

  it("shifts water well upgradeReadyAt by downtime when re-placing", () => {
    const removedAt = dateNow - 120000;
    const upgradeReadyAt = dateNow + 500000;

    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Water Well": new Decimal(1),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Water Well": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt,
            },
          ],
        },
        waterWell: { level: 1, upgradeReadyAt },
      },
      action: {
        type: "building.placed",
        name: "Water Well",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    const downtimeDelta = dateNow - removedAt;
    expect(state.waterWell.upgradeReadyAt).toEqual(
      upgradeReadyAt + downtimeDelta,
    );
  });

  it("does not shift aging shed timers when placing a second aging shed instance", () => {
    const removedAt = dateNow - 120000;
    const jobStartedAt = dateNow - 180000;
    const jobReadyAt = dateNow + 60 * 60 * 1000;

    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Aging Shed": new Decimal(2),
          "Basic Land": new Decimal(10),
        },
        buildings: {
          "Aging Shed": [
            {
              id: "first",
              createdAt: dateNow,
              readyAt: dateNow,
              coordinates: { x: 0, y: 0 },
            },
            {
              id: "second",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt,
            },
          ],
        },
        agingShed: {
          ...createInitialAgingShed(),
          racks: {
            ...createInitialAgingShed().racks,
            fermentation: [
              {
                id: "job-1",
                recipe: "Pickled Radish",
                startedAt: jobStartedAt,
                readyAt: jobReadyAt,
              },
            ],
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Aging Shed",
        id: "second",
        coordinates: { x: 0, y: 4 },
      },
      createdAt: dateNow,
    });

    expect(state.agingShed.racks.fermentation[0].startedAt).toEqual(
      jobStartedAt,
    );
    expect(state.agingShed.racks.fermentation[0].readyAt).toEqual(jobReadyAt);
  });

  it("does not adjust the new readyAt for second instance of building", () => {
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Hen House": new Decimal(2),
        },
        buildings: {
          "Hen House": [
            {
              id: "123",
              readyAt: 0,
              createdAt: 0,
              coordinates: { x: 0, y: 0 },
            },
            {
              id: "456",
              readyAt: 0,
              createdAt: 0,
              removedAt: dateNow - 2 * 24 * 60 * 60 * 1000,
            },
          ],
        },
        henHouse: {
          level: 1,
          animals: {
            123: {
              id: "123",
              type: "Chicken",
              state: "idle",
              createdAt: dateNow - 180000,
              experience: 1000,
              asleepAt: dateNow - 180000,
              awakeAt: dateNow - 180000 + 24 * 60 * 60 * 1000,
              lovedAt: 0,
              item: "Brush",
            },
            456: {
              id: "456",
              type: "Chicken",
              state: "idle",
              createdAt: dateNow - 180000,
              experience: 1000,
              asleepAt: dateNow - 180000,
              awakeAt: dateNow - 180000 + 24 * 60 * 60 * 1000,
              lovedAt: 0,
              item: "Brush",
            },
            789: {
              id: "789",
              type: "Chicken",
              state: "idle",
              createdAt: dateNow - 180000,
              experience: 1000,
              asleepAt: dateNow - 180000,
              awakeAt: dateNow - 180000 + 24 * 60 * 60 * 1000,
              lovedAt: 0,
              item: "Brush",
            },
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Hen House",
        id: "456",
        coordinates: { x: 0, y: 3 },
      },
      createdAt: dateNow,
    });

    expect(state.henHouse.animals["123"].asleepAt).toEqual(dateNow - 180000);
    expect(state.henHouse.animals["456"].asleepAt).toEqual(dateNow - 180000);
    expect(state.henHouse.animals["789"].asleepAt).toEqual(dateNow - 180000);
  });
  // FE + BE jest run amoy, so SPEED_BOOSTS is ON by default here.
  it("shifts a windowed animal's sleep across a lift without losing duration", () => {
    const SLEEP = 24 * 60 * 60 * 1000;
    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Basic Land": new Decimal(10),
          "Hen House": new Decimal(1),
        },
        buildings: {
          "Hen House": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 120000,
            },
          ],
        },
        henHouse: {
          level: 1,
          animals: {
            "123": {
              type: "Chicken",
              id: "123",
              state: "idle",
              createdAt: dateNow - 180000,
              experience: 1000,
              asleepAt: dateNow - 180000,
              awakeAt: dateNow - 180000 + SLEEP,
              baseDurationMs: SLEEP,
              lovedAt: 0,
              item: "Brush",
            },
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Hen House",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    const animal = state.henHouse.animals["123"];
    // The sleep resumes from a start shifted by the 120s the building spent
    // lifted, keeping its full duration — so the lifted interval doesn't count
    // and the animal certainly doesn't complete on placement.
    expect(animal.asleepAt).toEqual(dateNow - 60000);
    expect(animal.baseDurationMs).toEqual(SLEEP);
    expect(getAnimalReadyAt(animal, state)).toEqual(dateNow - 60000 + SLEEP);
  });
  // Regression: the lift must not hand back a love slot. `asleepAt` is the love
  // cadence anchor as well as the sleep timer's start, so moving it forward
  // compresses the cycle and re-opens slots the player already spent — the same
  // reason migrateSpeedBoosts refuses to freeze animals.
  it("does not grant an extra love slot when a windowed animal's building is lifted", () => {
    const HOUR = 60 * 60 * 1000;
    const SLEEP = 24 * HOUR;
    const asleepAt = dateNow - 20 * HOUR;

    const state = placeBuilding({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          "Basic Land": new Decimal(10),
          "Hen House": new Decimal(1),
        },
        buildings: {
          "Hen House": [
            {
              id: "123",
              createdAt: dateNow,
              readyAt: dateNow,
              removedAt: dateNow - 60000,
            },
          ],
        },
        henHouse: {
          level: 1,
          animals: {
            "123": {
              type: "Chicken",
              id: "123",
              state: "idle",
              createdAt: asleepAt,
              experience: 1000,
              asleepAt,
              awakeAt: asleepAt + SLEEP,
              baseDurationMs: SLEEP,
              // Both slots of this cycle already spent (8h and 16h in).
              lovedAt: asleepAt + 16 * HOUR,
              item: "Brush",
            },
          },
        },
      },
      action: {
        type: "building.placed",
        name: "Hen House",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: dateNow,
    });

    const animal = state.henHouse.animals["123"];
    const readyAt = getAnimalReadyAt(animal, state);

    // No slot remains this cycle, so the next one must fall at or after waking.
    expect(getNextLoveAvailableAt(animal, readyAt)).toBeGreaterThanOrEqual(
      readyAt,
    );
    expect(isAnimalNeedingLove(animal, readyAt - 1, readyAt)).toBe(false);
  });
});

describe("placeBuilding (windowed crop machine)", () => {
  const HOUR = 60 * 60 * 1000;
  const at = Date.now();

  const liftedMachine = (
    overrides: Record<string, unknown> = {},
  ): GameState => ({
    ...GAME_STATE,
    inventory: {
      ...GAME_STATE.inventory,
      "Crop Machine": new Decimal(1),
      "Basic Land": new Decimal(10),
    },
    buildings: {
      "Crop Machine": [
        {
          id: "123",
          createdAt: 0,
          readyAt: 0,
          coordinates: undefined,
          removedAt: at - 2 * HOUR,
          // Settled at the lift by removeBuilding: 1h of work already banked.
          oilSettledAt: at - 2 * HOUR,
          unallocatedOilTime: 9 * HOUR,
          queue: [
            {
              crop: "Sunflower",
              seeds: 10,
              growTimeRemaining: 3 * HOUR,
              totalGrowTime: 4 * HOUR,
              baseDurationMs: 3 * HOUR,
            },
          ],
          ...overrides,
        },
      ],
    },
  });

  it("re-anchors the fuel ledger across the downtime: the lifted interval costs neither fuel nor credit", () => {
    const state = placeBuilding({
      farmId: 1,
      state: liftedMachine(),
      action: {
        type: "building.placed",
        name: "Crop Machine",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: at,
    });

    const machine = state.buildings["Crop Machine"]?.[0];
    const pack = machine?.queue?.[0];

    expect(machine?.removedAt).toBeUndefined();
    expect(machine?.oilSettledAt).toBe(at);
    expect(machine?.unallocatedOilTime).toBe(9 * HOUR);
    // The banked work is untouched; the remainder resumes from placement.
    expect(pack?.baseDurationMs).toBe(3 * HOUR);
    expect(pack?.readyAt).toBe(at + 3 * HOUR);
    expect(pack?.growTimeRemaining).toBe(0);
  });

  it("keeps a completed pack harvestable across the lift", () => {
    const state = placeBuilding({
      farmId: 1,
      state: liftedMachine({
        queue: [
          {
            crop: "Sunflower",
            seeds: 10,
            growTimeRemaining: 0,
            totalGrowTime: HOUR,
            readyAt: at - 3 * HOUR,
          },
        ],
      }),
      action: {
        type: "building.placed",
        name: "Crop Machine",
        id: "123",
        coordinates: { x: 0, y: 1 },
      },
      createdAt: at,
    });

    const pack = state.buildings["Crop Machine"]?.[0]?.queue?.[0];
    // Finalised history is never shifted forward.
    expect(pack?.readyAt).toBe(at - 3 * HOUR);
  });
});
