import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { TEST_FARM } from "./constants";
import type { GameState, PlacedItem } from "../types/game";
import type { ScheduledWeatherEvent } from "../types/weather";
import { placeCollectible } from "../events/landExpansion/placeCollectible";
import { removeCollectible } from "../events/landExpansion/removeCollectible";
import { TORNADO_BUILDINGS } from "./weatherTornado";
import { cook } from "../events/landExpansion/cook";
import { collectRecipe } from "../events/landExpansion/collectRecipe";
import { cancelQueuedRecipe } from "../events/landExpansion/cancelQueuedRecipe";
import { speedUpRecipe } from "../events/landExpansion/speedUpRecipe";
import { supplyCookingOil } from "../events/landExpansion/supplyCookingOil";
import { processProcessedResource } from "../events/landExpansion/processResource";
import { collectProcessedResource } from "../events/landExpansion/collectProcessedResource";
import { cancelProcessedResource } from "../events/landExpansion/cancelProcessedResource";
import { speedUpProcessing } from "../events/landExpansion/speedUpProcessing";
import { buyAnimal } from "../events/landExpansion/buyAnimal";
import { feedAnimal } from "../events/landExpansion/feedAnimal";
import { feedAllAnimals } from "../events/landExpansion/feedAllAnimals";
import { loveAnimal } from "../events/landExpansion/loveAnimal";
import { wakeAnimal } from "../events/landExpansion/wakeUpAnimal";
import { claimProduce } from "../events/landExpansion/claimProduce";
import { applyAnimalFeedBuff } from "../events/landExpansion/applyAnimalFeedBuff";
import { sellAnimal } from "../events/landExpansion/sellAnimal";
import { applyMud } from "../events/landExpansion/applyMud";
import { bulkApplyMud } from "../events/landExpansion/bulkApplyMud";
import { tradeInPig } from "../events/landExpansion/tradeInPig";
import { upgradeBuilding } from "../events/landExpansion/upgradeBuilding";
import { speedUpUpgrade } from "../events/landExpansion/speedUpUpgrade";
import { startComposter } from "../events/landExpansion/startComposter";
import { collectCompost } from "../events/landExpansion/collectCompost";
import { accelerateComposter } from "../events/landExpansion/accelerateComposter";
import { plantGreenhouse } from "../events/landExpansion/plantGreenhouse";
import { harvestGreenHouse } from "../events/landExpansion/harvestGreenHouse";
import { fertiliseGreenhouse } from "../events/landExpansion/fertiliseGreenhouse";
import { oilGreenhouse } from "../events/landExpansion/oilGreenHouse";
import { supplyCropMachine } from "../events/landExpansion/supplyCropMachine";
import { supplyCropMachineOil } from "../events/landExpansion/supplyCropMachineOil";
import { harvestCropMachine } from "../events/landExpansion/harvestCropMachine";
import { removeCropMachinePack } from "../events/landExpansion/removeCropMachinePack";
import { startCrafting } from "../events/landExpansion/startCrafting";
import { collectCrafting } from "../events/landExpansion/collectCrafting";
import { cancelQueuedCrafting } from "../events/landExpansion/cancelQueuedCrafting";
import { speedUpCrafting } from "../events/landExpansion/speedUpCrafting";
import { startAging } from "../events/landExpansion/startAging";
import { collectAgedFish } from "../events/landExpansion/collectAgedFish";
import { startFermentation } from "../events/landExpansion/startFermentation";
import { collectFermentation } from "../events/landExpansion/collectFermentation";
import { startSpiceRack } from "../events/landExpansion/startSpiceRack";
import { collectSpiceRack } from "../events/landExpansion/collectSpiceRack";
import { startCaveBatch } from "../events/landExpansion/startCaveBatch";
import { digCaveTile } from "../events/landExpansion/digCaveTile";
import { drillCaveTiles } from "../events/landExpansion/drillCaveTiles";
import { expandCave } from "../events/landExpansion/expandCave";
import { speedUpCaveExpansion } from "../events/landExpansion/speedUpCaveExpansion";
import { completeCaveExpansion } from "../events/landExpansion/completeCaveExpansion";
import { buyCaveMerchantOffer } from "../events/landExpansion/buyCaveMerchantOffer";
import { skillUse } from "../events/landExpansion/skillUsed";
import {
  assertBuildingNotDisabled,
  getTornadoDisabledBuildingIds,
  isBuildingDisabled,
} from "./weatherTornado";

const HOUR = 60 * 60 * 1000;

// The autumn week of 2026-11-30 has a four-day Tornado from Thursday.
const TORNADO: ScheduledWeatherEvent = {
  name: "tornado",
  startAt: Date.UTC(2026, 11, 3),
  endAt: Date.UTC(2026, 11, 7),
};
const MID = TORNADO.startAt + 24 * HOUR;

// The next Tornado on the schedule.
const NEXT_TORNADO: ScheduledWeatherEvent = {
  name: "tornado",
  startAt: Date.UTC(2026, 11, 28),
  endAt: Date.UTC(2026, 11, 31),
};

// Away from where the Balk and the Guardian are placed.
const building = (id: string, fields: Partial<PlacedItem> = {}) => ({
  id,
  coordinates: { x: -20, y: -20 },
  createdAt: 0,
  readyAt: 0,
  ...fields,
});

const placed = (id: string, placedAt: number): PlacedItem => ({
  id,
  coordinates: { x: id === "g" ? 4 : 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
  placedAt,
});

const farm = (fields: Partial<GameState> = {}): GameState => ({
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    Balk: new Decimal(1),
    "Autumn Guardian": new Decimal(1),
  },
  collectibles: {},
  trees: {},
  stones: {},
  gold: {},
  iron: {},
  crimstones: {},
  sunstones: {},
  oilReserves: {},
  crops: {},
  fruitPatches: {},
  beehives: {},
  lavaPits: {},
  flowers: { ...TEST_FARM.flowers, flowerBeds: {} },
  buildings: {
    Kitchen: [building("kitchen")],
    Barn: [building("barn")],
    "Fire Pit": [building("fire-pit")],
    "Town Center": [building("town-center")],
  },
  // The client reads the forecast and the pick the server sends.
  weather: {
    forecast: [TORNADO, NEXT_TORNADO],
    overlays: [],
    tornado: { startAt: TORNADO.startAt, buildingIds: ["kitchen"] },
  },
  ...fields,
});

const move = (
  state: GameState,
  name: "Balk" | "Autumn Guardian",
  type: "placed" | "removed",
  createdAt: number,
) => {
  const id = name === "Autumn Guardian" ? "g" : "1";

  return type === "placed"
    ? placeCollectible({
        state,
        action: {
          type: "collectible.placed",
          name,
          id,
          coordinates: { x: id === "g" ? 4 : 0, y: 0 },
          location: "farm",
        },
        createdAt,
      })
    : removeCollectible({
        state,
        action: { type: "collectible.removed", name, id, location: "farm" },
        createdAt,
      });
};

describe("weatherTornado", () => {
  it("disables the stored buildings while the Tornado runs", () => {
    const game = farm();

    expect(getTornadoDisabledBuildingIds({ game, now: MID })).toEqual([
      "kitchen",
    ]);
    expect(isBuildingDisabled({ game, name: "Kitchen", now: MID })).toBe(true);
    expect(
      isBuildingDisabled({ game, name: "Kitchen", id: "kitchen", now: MID }),
    ).toBe(true);
  });

  it("leaves the other buildings working", () => {
    const game = farm();

    expect(isBuildingDisabled({ game, name: "Barn", now: MID })).toBe(false);
    expect(isBuildingDisabled({ game, name: "Fire Pit", now: MID })).toBe(
      false,
    );
  });

  it("disables nothing before the Tornado starts or once it has ended", () => {
    const game = farm();

    expect(
      getTornadoDisabledBuildingIds({ game, now: TORNADO.startAt - 1 }),
    ).toEqual([]);
    expect(getTornadoDisabledBuildingIds({ game, now: TORNADO.endAt })).toEqual(
      [],
    );
    expect(
      getTornadoDisabledBuildingIds({ game, now: TORNADO.startAt }),
    ).toEqual(["kitchen"]);
  });

  it("ignores a pick stored for another Tornado", () => {
    const game = farm({
      weather: {
        forecast: [TORNADO, NEXT_TORNADO],
        overlays: [],
        tornado: { startAt: NEXT_TORNADO.startAt, buildingIds: ["kitchen"] },
      },
    });

    expect(getTornadoDisabledBuildingIds({ game, now: MID })).toEqual([]);
    expect(
      getTornadoDisabledBuildingIds({
        game,
        now: NEXT_TORNADO.startAt + HOUR,
      }),
    ).toEqual(["kitchen"]);
    expect(
      getTornadoDisabledBuildingIds({
        game: farm(),
        now: NEXT_TORNADO.startAt + HOUR,
      }),
    ).toEqual([]);
  });

  it("disables nothing without a stored pick", () => {
    const game = farm({ weather: { forecast: [TORNADO], overlays: [] } });

    expect(getTornadoDisabledBuildingIds({ game, now: MID })).toEqual([]);
  });

  describe("Balk", () => {
    it("protects the whole farm when placed before the Tornado", () => {
      const game = farm({
        collectibles: { Balk: [placed("1", TORNADO.startAt - HOUR)] },
      });

      expect(getTornadoDisabledBuildingIds({ game, now: MID })).toEqual([]);
    });

    it("re-enables the buildings from the moment it's placed mid-Tornado", () => {
      const before = farm();
      const game = move(before, "Balk", "placed", MID);

      expect(getTornadoDisabledBuildingIds({ game: before, now: MID })).toEqual(
        ["kitchen"],
      );
      expect(getTornadoDisabledBuildingIds({ game, now: MID })).toEqual([]);
      expect(
        getTornadoDisabledBuildingIds({ game, now: TORNADO.endAt - 1 }),
      ).toEqual([]);
    });

    it("disables them again once it's lifted", () => {
      const placedGame = move(farm(), "Balk", "placed", MID);
      const game = move(placedGame, "Balk", "removed", MID + HOUR);

      expect(getTornadoDisabledBuildingIds({ game, now: MID + HOUR })).toEqual([
        "kitchen",
      ]);
    });
  });

  describe("Guardian", () => {
    it("protects the farm when out at the Tornado's start", () => {
      const game = farm({
        collectibles: {
          "Autumn Guardian": [placed("g", TORNADO.startAt - HOUR)],
        },
      });

      expect(getTornadoDisabledBuildingIds({ game, now: MID })).toEqual([]);
    });

    it("doesn't protect it when placed after the start", () => {
      const game = move(farm(), "Autumn Guardian", "placed", MID);

      expect(getTornadoDisabledBuildingIds({ game, now: MID + HOUR })).toEqual([
        "kitchen",
      ]);
    });
  });

  it("throws on a disabled building", () => {
    const game = farm();

    expect(() =>
      assertBuildingNotDisabled({ game, name: "Kitchen", now: MID }),
    ).toThrow("Kitchen is disabled by the Tornado");
    expect(() =>
      assertBuildingNotDisabled({ game, name: "Barn", now: MID }),
    ).not.toThrow();
  });

  describe("with the weather flag off", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("disables nothing", () => {
      const game = farm();

      expect(getTornadoDisabledBuildingIds({ game, now: MID })).toEqual([]);
      expect(isBuildingDisabled({ game, name: "Kitchen", now: MID })).toBe(
        false,
      );
    });
  });
});

describe("actions on a disabled building", () => {
  const DISABLED = "is disabled by the Tornado";
  const NOW = MID;

  // Every production building placed, with the building's name as its id, and
  // the Tornado disabling all of them.
  const disabled = (fields: Partial<GameState> = {}): GameState =>
    farm({
      coins: 10_000_000,
      inventory: { ...farm().inventory, Mud: new Decimal(1000) },
      buildings: {
        ...Object.fromEntries(
          TORNADO_BUILDINGS.map((name) => [name, [building(name)]]),
        ),
        "Town Center": [building("town-center")],
      },
      cave: { builtAt: 1, tier: 1, machines: { "1": {} } },
      weather: {
        forecast: [TORNADO],
        overlays: [],
        tornado: {
          startAt: TORNADO.startAt,
          buildingIds: [...TORNADO_BUILDINGS],
        },
      },
      ...fields,
    });
  const protectedByBalk = () =>
    disabled({ collectibles: { Balk: [placed("1", TORNADO.startAt - HOUR)] } });

  const QUEUE_ITEM = { name: "Mashed Potato" as const, readyAt: NOW + HOUR };

  const ACTIONS: [string, (state: GameState) => unknown][] = [
    [
      "recipe.cooked",
      (state) =>
        cook({
          state,
          action: {
            type: "recipe.cooked",
            item: "Mashed Potato",
            buildingId: "Fire Pit",
          },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "recipes.collected",
      (state) =>
        collectRecipe({
          state,
          action: {
            type: "recipes.collected",
            building: "Kitchen",
            buildingId: "Kitchen",
          },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "recipe.cancelled",
      (state) =>
        cancelQueuedRecipe({
          state,
          action: {
            type: "recipe.cancelled",
            buildingName: "Fire Pit",
            buildingId: "Fire Pit",
            queueItem: QUEUE_ITEM,
          },
          createdAt: NOW,
        }),
    ],
    [
      "recipe.spedUp",
      (state) =>
        speedUpRecipe({
          state,
          action: {
            type: "recipe.spedUp",
            buildingName: "Bakery",
            buildingId: "Bakery",
          },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "cookingOil.supplied",
      (state) =>
        supplyCookingOil({
          state,
          action: {
            type: "cookingOil.supplied",
            building: "Deli",
            buildingId: "Deli",
            oilQuantity: 1,
          },
          createdAt: NOW,
        }),
    ],
    [
      "processedResource.processed",
      (state) =>
        processProcessedResource({
          state,
          action: {
            type: "processedResource.processed",
            item: "Fish Flake",
            buildingName: "Fish Market",
            buildingId: "Fish Market",
          },
          createdAt: NOW,
        }),
    ],
    [
      "processedResource.collected",
      (state) =>
        collectProcessedResource({
          state,
          action: {
            type: "processedResource.collected",
            buildingName: "Fish Market",
            buildingId: "Fish Market",
          },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "processedResource.cancelled",
      (state) =>
        cancelProcessedResource({
          state,
          action: {
            type: "processedResource.cancelled",
            buildingName: "Fish Market",
            buildingId: "Fish Market",
            queueItem: { name: "Fish Flake", readyAt: NOW + HOUR },
          },
          createdAt: NOW,
        }),
    ],
    [
      "processing.spedUp",
      (state) =>
        speedUpProcessing({
          state,
          action: {
            type: "processing.spedUp",
            buildingName: "Fish Market",
            buildingId: "Fish Market",
          },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "animal.bought",
      (state) =>
        buyAnimal({
          state,
          action: { type: "animal.bought", id: "new", animal: "Chicken" },
          createdAt: NOW,
        }),
    ],
    [
      "animal.fed",
      (state) =>
        feedAnimal({
          state,
          action: { type: "animal.fed", animal: "Cow", id: "0" },
          createdAt: NOW,
        }),
    ],
    [
      "animals.fedAll",
      (state) =>
        feedAllAnimals({
          state,
          action: { type: "animals.fedAll", building: "Barn" },
          createdAt: NOW,
        }),
    ],
    [
      "animal.loved",
      (state) =>
        loveAnimal({
          state,
          action: {
            type: "animal.loved",
            animal: "Sheep",
            id: "0",
            item: "Petting Hand",
          },
          createdAt: NOW,
        }),
    ],
    [
      "animal.wakeUp",
      (state) =>
        wakeAnimal({
          state,
          action: { type: "animal.wakeUp", animal: "Chicken", id: "0" },
          createdAt: NOW,
        }),
    ],
    [
      "produce.claimed",
      (state) =>
        claimProduce({
          state,
          action: { type: "produce.claimed", animal: "Pig", id: "0" },
          createdAt: NOW,
        }),
    ],
    [
      "animal.feedBuffApplied",
      (state) =>
        applyAnimalFeedBuff({
          state,
          action: {
            type: "animal.feedBuffApplied",
            animal: "Cow",
            id: "0",
            item: "Salt Lick",
          },
          createdAt: NOW,
        }),
    ],
    [
      "animal.sold",
      (state) =>
        sellAnimal({
          state: {
            ...state,
            bounties: {
              ...state.bounties,
              requests: [
                {
                  id: "bounty",
                  name: "Cow",
                  level: 1,
                  coins: 10,
                },
              ],
            },
          },
          action: { type: "animal.sold", requestId: "bounty", animalId: "0" },
          createdAt: NOW,
        }),
    ],
    [
      "animal.mudApplied",
      (state) =>
        applyMud({
          state,
          action: { type: "animal.mudApplied", id: "0" },
          createdAt: NOW,
        }),
    ],
    [
      "pigs.bulkMudApplied",
      (state) =>
        bulkApplyMud({
          state,
          action: { type: "pigs.bulkMudApplied" },
          createdAt: NOW,
        }),
    ],
    [
      "pig.tradedIn",
      (state) =>
        tradeInPig({
          state,
          action: { type: "pig.tradedIn", id: "0" },
          createdAt: NOW,
        }),
    ],
    [
      "building.upgraded",
      (state) =>
        upgradeBuilding({
          state,
          action: { type: "building.upgraded", buildingType: "Hen House" },
          createdAt: NOW,
        }),
    ],
    [
      "upgrade.spedUp",
      (state) =>
        speedUpUpgrade({
          state,
          action: { type: "upgrade.spedUp", name: "Barn" },
          createdAt: NOW,
        }),
    ],
    [
      "composter.started",
      (state) =>
        startComposter({
          state,
          action: { type: "composter.started", building: "Compost Bin" },
          createdAt: NOW,
        }),
    ],
    [
      "compost.collected",
      (state) =>
        collectCompost({
          state,
          action: {
            type: "compost.collected",
            building: "Turbo Composter",
            buildingId: "Turbo Composter",
          },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "compost.accelerated",
      (state) =>
        accelerateComposter({
          state,
          action: {
            type: "compost.accelerated",
            building: "Premium Composter",
          },
          createdAt: NOW,
        }),
    ],
    [
      "greenhouse.planted",
      (state) =>
        plantGreenhouse({
          state,
          action: { type: "greenhouse.planted", seed: "Grape Seed", id: 1 },
          createdAt: NOW,
        }),
    ],
    [
      "greenhouse.harvested",
      (state) =>
        harvestGreenHouse({
          state,
          action: { type: "greenhouse.harvested", id: 1 },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "greenhouse.fertilised",
      (state) =>
        fertiliseGreenhouse({
          state,
          action: {
            type: "greenhouse.fertilised",
            id: 1,
            fertiliser: "Greenhouse Glow",
          },
          createdAt: NOW,
        }),
    ],
    [
      "greenhouse.oiled",
      (state) =>
        oilGreenhouse({
          state,
          action: { type: "greenhouse.oiled", amount: 1 },
          createdAt: NOW,
        }),
    ],
    [
      "cropMachine.supplied",
      (state) =>
        supplyCropMachine({
          state,
          action: {
            type: "cropMachine.supplied",
            seeds: { type: "Sunflower Seed", amount: 1 },
            machineId: "Crop Machine",
          },
          createdAt: NOW,
        }),
    ],
    [
      "cropMachine.oilSupplied",
      (state) =>
        supplyCropMachineOil({
          state,
          action: {
            type: "cropMachine.oilSupplied",
            oil: 1,
            machineId: "Crop Machine",
          },
          createdAt: NOW,
        }),
    ],
    [
      "cropMachine.harvested",
      (state) =>
        harvestCropMachine({
          state,
          action: {
            type: "cropMachine.harvested",
            packIndex: 0,
            machineId: "Crop Machine",
          },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "cropMachine.packRemoved",
      (state) =>
        removeCropMachinePack({
          state,
          action: {
            type: "cropMachine.packRemoved",
            packIndex: 0,
            machineId: "Crop Machine",
          },
          createdAt: NOW,
        }),
    ],
    [
      "crafting.started",
      (state) =>
        startCrafting({
          state,
          action: {
            type: "crafting.started",
            ingredients: Array(9).fill(null),
            queueItemId: "q",
          },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "crafting.collected",
      (state) =>
        collectCrafting({
          state: {
            ...state,
            craftingBox: {
              ...state.craftingBox,
              queue: [
                {
                  id: "q",
                  type: "collectible",
                  name: "Timber",
                  readyAt: NOW - HOUR,
                  startedAt: 0,
                },
              ],
            },
          },
          action: { type: "crafting.collected" },
          createdAt: NOW,
        }),
    ],
    [
      "crafting.cancelled",
      (state) =>
        cancelQueuedCrafting({
          state,
          action: { type: "crafting.cancelled", queueItemId: "q" },
          createdAt: NOW,
        }),
    ],
    [
      "crafting.spedUp",
      (state) =>
        speedUpCrafting({
          state,
          action: { type: "crafting.spedUp" },
          createdAt: NOW,
        }),
    ],
    [
      "agingRack.started",
      (state) =>
        startAging({
          state,
          action: { type: "agingRack.started", fish: "Anchovy", slotId: "1" },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "agingRack.collected",
      (state) =>
        collectAgedFish({
          state,
          action: { type: "agingRack.collected" },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "fermentation.started",
      (state) =>
        startFermentation({
          state,
          action: {
            type: "fermentation.started",
            recipe: "Zesty Sauerkraut" as never,
            jobId: "j",
          },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "fermentation.collected",
      (state) =>
        collectFermentation({
          state,
          action: { type: "fermentation.collected" },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "spiceRack.started",
      (state) =>
        startSpiceRack({
          state,
          action: {
            type: "spiceRack.started",
            recipe: "Fishy Spice" as never,
            jobId: "j",
          },
          createdAt: NOW,
        }),
    ],
    [
      "spiceRack.collected",
      (state) =>
        collectSpiceRack({
          state,
          action: { type: "spiceRack.collected" },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "cave.batchStarted",
      (state) =>
        startCaveBatch({
          state,
          action: {
            type: "cave.batchStarted",
            machineId: "1",
            recipe: "Mushroom" as never,
          },
          createdAt: NOW,
        }),
    ],
    [
      "cave.dug",
      (state) =>
        digCaveTile({
          state,
          action: { type: "cave.dug", machineId: "1", x: 0, y: 0 },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "cave.drilled",
      (state) =>
        drillCaveTiles({
          state,
          action: {
            type: "cave.drilled",
            machineId: "1",
            coords: [{ x: 0, y: 0 }],
          },
          createdAt: NOW,
          farmId: 1,
        }),
    ],
    [
      "cave.expanded",
      (state) =>
        expandCave({
          state,
          action: { type: "cave.expanded" },
          createdAt: NOW,
        }),
    ],
    [
      "cave.expansionSpedUp",
      (state) =>
        speedUpCaveExpansion({
          state,
          action: { type: "cave.expansionSpedUp" },
          createdAt: NOW,
        }),
    ],
    [
      "cave.expansionCompleted",
      (state) =>
        completeCaveExpansion({
          state,
          action: { type: "cave.expansionCompleted" },
          createdAt: NOW,
        }),
    ],
    [
      "cave.merchantOfferBought",
      (state) =>
        buyCaveMerchantOffer({
          state,
          action: { type: "cave.merchantOfferBought", visit: 0, slot: 1 },
          createdAt: NOW,
        }),
    ],
  ];

  it.each(ACTIONS)("rejects %s", (_, act) => {
    expect(() => act(disabled())).toThrow(DISABLED);
  });

  it.each(ACTIONS)("lets %s through behind a Balk", (_, act) => {
    expect(() => act(protectedByBalk())).not.toThrow(DISABLED);
  });

  it("leaves the buildings the Tornado didn't pick working", () => {
    const game = disabled({
      weather: {
        forecast: [TORNADO],
        overlays: [],
        tornado: { startAt: TORNADO.startAt, buildingIds: ["Kitchen"] },
      },
    });

    ACTIONS.forEach(([, act]) => {
      if (act === ACTIONS[1][1]) return;
      expect(() => act(game)).not.toThrow(DISABLED);
    });
    expect(() => ACTIONS[1][1](game)).toThrow(DISABLED);
  });
});

describe("power skills during the Tornado", () => {
  const sleeping = (id: string, type: "Chicken" | "Cow") => ({
    id,
    type,
    state: "idle" as const,
    createdAt: 0,
    awakeAt: MID + 24 * HOUR,
    experience: 120,
    asleepAt: MID - HOUR,
    lovedAt: 0,
    item: "Petting Hand" as const,
  });

  // Every building disabled but the ones listed as working.
  const tornadoFarm = (
    skill: "Barnyard Rouse" | "Greenhouse Guru" | "Instant Gratification",
    disabledIds: string[],
    fields: Partial<GameState> = {},
  ) =>
    farm({
      bumpkin: {
        ...farm().bumpkin,
        skills: { [skill]: 1 },
        previousPowerUseAt: {},
      },
      buildings: {
        "Hen House": [building("Hen House")],
        Barn: [building("Barn")],
        Greenhouse: [building("Greenhouse")],
        "Fire Pit": [building("Fire Pit")],
      },
      weather: {
        forecast: [TORNADO],
        overlays: [],
        tornado: { startAt: TORNADO.startAt, buildingIds: disabledIds },
      },
      ...fields,
    });

  const use = (
    state: GameState,
    skill: "Barnyard Rouse" | "Greenhouse Guru" | "Instant Gratification",
  ) =>
    skillUse({
      state,
      action: { type: "skill.used", skill },
      createdAt: MID,
    });

  it("Barnyard Rouse leaves the animals of a disabled building asleep", () => {
    const state = use(
      tornadoFarm("Barnyard Rouse", ["Hen House"], {
        henHouse: { level: 1, animals: { "1": sleeping("1", "Chicken") } },
        barn: { level: 1, animals: { "2": sleeping("2", "Cow") } },
      }),
      "Barnyard Rouse",
    );

    expect(state.henHouse.animals["1"].awakeAt).toBe(MID + 24 * HOUR);
    expect(state.barn.animals["2"].awakeAt).toBe(MID);
  });

  it("Barnyard Rouse can't be used when only disabled buildings sleep", () => {
    const game = tornadoFarm("Barnyard Rouse", ["Hen House"], {
      henHouse: { level: 1, animals: { "1": sleeping("1", "Chicken") } },
      barn: { level: 1, animals: {} },
    });

    expect(() => use(game, "Barnyard Rouse")).toThrow(
      "All your animals are not asleep",
    );
    expect(() =>
      use(
        { ...game, weather: { forecast: [TORNADO], overlays: [] } },
        "Barnyard Rouse",
      ),
    ).not.toThrow();
  });

  it("Greenhouse Guru can't be used on a disabled Greenhouse", () => {
    const game = tornadoFarm("Greenhouse Guru", ["Greenhouse"], {
      greenhouse: {
        oil: 50,
        pots: { "1": { plant: { name: "Olive", plantedAt: MID - HOUR } } },
      },
    });

    expect(() => use(game, "Greenhouse Guru")).toThrow();
    expect(
      use(
        { ...game, weather: { forecast: [TORNADO], overlays: [] } },
        "Greenhouse Guru",
      ).greenhouse.pots["1"].plant?.baseDurationMs,
    ).toBe(0);
  });

  it("Instant Gratification skips a disabled building", () => {
    const game = tornadoFarm("Instant Gratification", ["Fire Pit"], {
      buildings: {
        "Fire Pit": [
          building("Fire Pit", {
            oil: 10,
            crafting: [
              {
                name: "Mashed Potato",
                readyAt: MID + HOUR,
                startedAt: MID - HOUR,
              },
            ],
          }),
        ],
      },
    });

    expect(() => use(game, "Instant Gratification")).toThrow(
      "No buildings are cooking",
    );
    expect(
      use(
        { ...game, weather: { forecast: [TORNADO], overlays: [] } },
        "Instant Gratification",
      ).buildings["Fire Pit"]?.[0].crafting?.[0].readyAt,
    ).toBe(MID);
  });
});
