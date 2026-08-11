import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  detectCollision,
  isOverlapping,
  isWithinAOE,
  type Position,
} from "./collisionDetection";
import type { Dimensions } from "features/game/types/buildings";
import cloneDeep from "lodash.clonedeep";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

describe("isOverlapping", () => {
  it("returns false if there is no overlap between two positions", () => {
    const position1: Position = { x: 1, y: 1, height: 1, width: 1 };
    const position2: Position = { x: 2, y: 1, height: 1, width: 1 };

    const overlappingPosition = isOverlapping(position1, position2);

    expect(overlappingPosition).toBe(false);
  });

  it("returns true if there is an overlap between two positions", () => {
    const position1: Position = { x: 1, y: 1, height: 1, width: 2 };
    const position2: Position = { x: 2, y: 1, height: 1, width: 2 };

    const overlappingPosition = isOverlapping(position1, position2);

    expect(overlappingPosition).toBe(true);
  });
});

describe("detectCollisions", () => {
  it("returns false if a collision is not detected", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.inventory["Basic Land"] = new Decimal(1);

    state.crops = {};

    const position: Position = { x: 0, y: 0, height: 1, width: 1 };

    const hasCollision = detectCollision({
      state,
      position,

      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(false);
  });

  it("returns true if a collision is detected with an expansion resource", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.inventory["Basic Land"] = new Decimal(1);

    const position: Position = { x: 0, y: 0, height: 1, width: 1 };

    state.crops = {
      0: {
        ...position,

        createdAt: Date.now(),
      },
    };

    const hasCollision = detectCollision({
      state,
      position,
      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(true);
  });

  it("returns true if a collision is detected with water", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.inventory["Basic Land"] = new Decimal(1);

    const hasCollision = detectCollision({
      state,
      position: {
        x: -4,
        y: 0,
        width: 2,
        height: 1,
      },
      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(true);
  });

  it("allows placement in a land corner", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.inventory["Basic Land"] = new Decimal(1);

    // Bottom-left corner tile of the starting expansion — previously blocked by
    // the land-corner collision, now placeable.
    const hasCollision = detectCollision({
      state,
      position: {
        x: -3,
        y: -2,
        width: 1,
        height: 1,
      },
      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(false);
  });

  it("returns true if a collision is detected with a building", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.buildings = {
      "Fire Pit": [
        {
          id: "123",
          coordinates: {
            x: 3,
            y: 3,
          },
          readyAt: 0,
          createdAt: 0,
        },
      ],
    };

    const hasCollision = detectCollision({
      state,
      position: {
        x: 3,
        y: 3,
        height: 1,
        width: 1,
      },
      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(true);
  });

  it("returns true if a collision is detected with a collectible", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.collectibles = {
      "Farm Cat": [
        {
          id: "123",
          coordinates: {
            x: 1,
            y: 1,
          },
          readyAt: 0,
          createdAt: 0,
        },
      ],
    };

    const hasCollision = detectCollision({
      state,
      position: {
        x: 1,
        y: 1,
        height: 1,
        width: 1,
      },
      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(true);
  });

  it("returns true if a collision is detected with a bud", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.buds = {
      1: {
        coordinates: {
          x: 0,
          y: 0,
        },
        aura: "Basic",
        colour: "Beige",
        ears: "Ears",
        stem: "3 Leaf Clover",
        type: "Beach",
      },
    };

    const hasCollision = detectCollision({
      state,
      position: {
        x: 0,
        y: 0,
        height: 1,
        width: 1,
      },
      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(true);
  });

  it("returns true if a collision is detected with a farmhand placed on the farm", () => {
    const state: GameState = clearPlaceables(cloneDeep(TEST_FARM));
    state.farmHands = {
      bumpkins: {
        "fh-1": {
          equipped: state.bumpkin.equipped,
          coordinates: { x: 1, y: 1 },
          location: "farm",
        },
      },
    };

    const hasCollision = detectCollision({
      state,
      position: { x: 1, y: 1, height: 1, width: 1 },
      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(true);
  });

  it("returns true if a collision is detected with the bumpkin placed on the farm", () => {
    const state: GameState = clearPlaceables(cloneDeep(TEST_FARM));
    state.bumpkin.coordinates = { x: 1, y: 1 };
    state.bumpkin.location = "farm";

    const hasCollision = detectCollision({
      state,
      position: { x: 1, y: 1, height: 1, width: 1 },
      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(true);
  });

  it("returns false when placing the bumpkin on its own coordinates (self-collision excluded)", () => {
    const state: GameState = clearPlaceables(cloneDeep(TEST_FARM));
    state.bumpkin.coordinates = { x: 1, y: 1 };
    state.bumpkin.location = "farm";

    const hasCollision = detectCollision({
      state,
      position: { x: 1, y: 1, height: 1, width: 1 },
      location: "farm",
      name: "Bumpkin",
    });

    expect(hasCollision).toBe(false);
  });

  it("returns false if the bumpkin is placed at home and a placeable is added on the farm at the same coordinates", () => {
    const state: GameState = clearPlaceables(cloneDeep(TEST_FARM));
    state.bumpkin.coordinates = { x: 1, y: 1 };
    state.bumpkin.location = "home";

    const hasCollision = detectCollision({
      state,
      position: { x: 1, y: 1, height: 1, width: 1 },
      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(false);
  });

  it("returns false if the bumpkin has no coordinates set", () => {
    const state: GameState = clearPlaceables(cloneDeep(TEST_FARM));
    delete state.bumpkin.coordinates;
    delete state.bumpkin.location;

    const hasCollision = detectCollision({
      state,
      position: { x: 1, y: 1, height: 1, width: 1 },
      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(false);
  });
});

function clearPlaceables(state: GameState): GameState {
  state.collectibles = {};
  state.buildings = {};
  state.crops = {};
  state.trees = {};
  state.stones = {};
  state.gold = {};
  state.iron = {};
  state.crimstones = {};
  state.sunstones = {};
  state.oilReserves = {};
  state.lavaPits = {};
  state.fruitPatches = {};
  state.beehives = {};
  state.flowers = { discovered: {}, flowerBeds: {} };
  state.buds = {};
  state.pets = { common: {}, nfts: {} };
  state.farmHands = { bumpkins: {} };
  state.airdrops = [];
  state.mushrooms = { spawnedAt: 0, mushrooms: {} };
  return state;
}

describe("isWithinAOE", () => {
  const plotDimensions: Dimensions = { ...RESOURCE_DIMENSIONS["Crop Plot"] };

  const plot1: Position = { x: -1, y: -2, ...plotDimensions };
  const plot2: Position = { x: -1, y: -3, ...plotDimensions };
  const plot3: Position = { x: -1, y: -4, ...plotDimensions };
  const plot4: Position = { x: 0, y: -2, ...plotDimensions };
  const plot5: Position = { x: 0, y: -3, ...plotDimensions };
  const plot6: Position = { x: 0, y: -4, ...plotDimensions };
  const plot7: Position = { x: 1, y: -2, ...plotDimensions };
  const plot8: Position = { x: 1, y: -3, ...plotDimensions };
  const plot9: Position = { x: 1, y: -4, ...plotDimensions };

  it.each([plot1, plot2, plot3, plot4, plot5, plot6, plot7, plot8, plot9])(
    "returns true if the crop is within the Basic Scarecrow AOE %s",
    (plot) => {
      const result = isWithinAOE(
        "Basic Scarecrow",
        { x: 0, y: 0, height: 2, width: 1 },
        plot,
        {},
      );

      expect(result).toBe(true);
    },
  );

  it.each([plot1, plot2, plot3, plot4, plot5, plot6, plot7, plot8, plot9])(
    "returns false if the crop is outside the Basic Scarecrow AOE %s",
    (plot) => {
      const result = isWithinAOE(
        "Basic Scarecrow",
        { x: 0, y: 0, height: 2, width: 1 },
        { ...plot, x: plot.x - 2, y: plot.y - 3 },
        {},
      );

      expect(result).toBe(false);
    },
  );

  it.each([plot1, plot2, plot3, plot4, plot5, plot6, plot7, plot8, plot9])(
    "returns true if Basic Scarecrow is inside boosted AOE (Chonky Scarecrow) %s",
    (plot) => {
      const result = isWithinAOE(
        "Basic Scarecrow",
        { x: 0, y: 0, height: 2, width: 1 },
        { ...plot, x: plot.x - 2, y: plot.y - 3 },
        {
          "Chonky Scarecrow": 1,
        },
      );

      expect(result).toBe(true);
    },
  );

  it.each([plot1, plot2, plot3, plot4, plot5, plot6, plot7, plot8, plot9])(
    "returns true if Scary Mike is inside boosted AOE (Horror Mike) %s",
    (plot) => {
      const result = isWithinAOE(
        "Scary Mike",
        { x: 0, y: 0, height: 2, width: 1 },
        { ...plot, x: plot.x - 2, y: plot.y - 3 },
        {
          "Horror Mike": 1,
        },
      );

      expect(result).toBe(true);
    },
  );

  it.each([plot1, plot2, plot3, plot4, plot5, plot6, plot7, plot8, plot9])(
    "returns true if Laurie the Chuckle Crow is inside boosted AOE (Laurie's Gain) %s",
    (plot) => {
      const result = isWithinAOE(
        "Laurie the Chuckle Crow",
        { x: 0, y: 0, height: 2, width: 1 },
        { ...plot, x: plot.x - 2, y: plot.y - 3 },
        {
          "Laurie's Gains": 1,
        },
      );

      expect(result).toBe(true);
    },
  );

  it("returns true if the crop is within the Scary Mike AOE", () => {
    const cropPlot1 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot1,
      {},
    );
    const cropPlot2 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot2,
      {},
    );

    const cropPlot3 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot3,
      {},
    );

    const cropPlot4 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot4,
      {},
    );

    const cropPlot5 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot5,
      {},
    );
    const cropPlot6 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot6,
      {},
    );
    const cropPlot7 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot7,
      {},
    );
    const cropPlot8 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot8,
      {},
    );
    const cropPlot9 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot9,
      {},
    );

    expect(cropPlot1).toBe(true);
    expect(cropPlot2).toBe(true);
    expect(cropPlot3).toBe(true);
    expect(cropPlot4).toBe(true);
    expect(cropPlot5).toBe(true);
    expect(cropPlot6).toBe(true);
    expect(cropPlot7).toBe(true);
    expect(cropPlot8).toBe(true);
    expect(cropPlot9).toBe(true);
  });

  it("returns false if the crop is outside the Scary Mike AOE", () => {
    const plotOutsideAOE1: Position = { x: -1, y: 0, ...plotDimensions };
    const plotOutsideAOE2: Position = { x: -1, y: -1, ...plotDimensions };
    const plotOutsideAOE3: Position = { x: 1, y: 0, ...plotDimensions };
    const plotOutsideAOE4: Position = { x: 1, y: -1, ...plotDimensions };
    const plotOutsideAOE5: Position = { x: -2, y: 0, ...plotDimensions };
    const plotOutsideAOE6: Position = { x: -2, y: -1, ...plotDimensions };
    const plotOutsideAOE7: Position = { x: -2, y: -2, ...plotDimensions };
    const plotOutsideAOE8: Position = { x: -2, y: -3, ...plotDimensions };
    const plotOutsideAOE9: Position = { x: -2, y: -4, ...plotDimensions };
    const plotOutsideAOE10: Position = { x: 2, y: 0, ...plotDimensions };
    const plotOutsideAOE11: Position = { x: 2, y: -1, ...plotDimensions };
    const plotOutsideAOE12: Position = { x: 2, y: -2, ...plotDimensions };
    const plotOutsideAOE13: Position = { x: 2, y: -3, ...plotDimensions };
    const plotOutsideAOE14: Position = { x: 2, y: -4, ...plotDimensions };

    const cropPlot1 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE1,
      {},
    );
    const cropPlot2 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE2,
      {},
    );

    const cropPlot3 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE3,
      {},
    );

    const cropPlot4 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE4,
      {},
    );

    const cropPlot5 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE5,
      {},
    );

    const cropPlot6 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE6,
      {},
    );

    const cropPlot7 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE7,
      {},
    );

    const cropPlot8 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE8,
      {},
    );

    const cropPlot9 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE9,
      {},
    );

    const cropPlot10 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE10,
      {},
    );

    const cropPlot11 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE11,
      {},
    );

    const cropPlot12 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE12,
      {},
    );

    const cropPlot13 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE13,
      {},
    );

    const cropPlot14 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE14,
      {},
    );

    expect(cropPlot1).toBe(false);
    expect(cropPlot2).toBe(false);
    expect(cropPlot3).toBe(false);
    expect(cropPlot4).toBe(false);
    expect(cropPlot5).toBe(false);
    expect(cropPlot6).toBe(false);
    expect(cropPlot7).toBe(false);
    expect(cropPlot8).toBe(false);
    expect(cropPlot9).toBe(false);
    expect(cropPlot10).toBe(false);
    expect(cropPlot11).toBe(false);
    expect(cropPlot12).toBe(false);
    expect(cropPlot13).toBe(false);
    expect(cropPlot14).toBe(false);
  });

  it("returns true if the crop is within the Laurie the Chuckle Crow AOE", () => {
    const cropPlot1 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot1,
      {},
    );
    const cropPlot2 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot2,
      {},
    );

    const cropPlot3 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot3,
      {},
    );

    const cropPlot4 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot4,
      {},
    );

    const cropPlot5 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot5,
      {},
    );
    const cropPlot6 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot6,
      {},
    );
    const cropPlot7 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot7,
      {},
    );
    const cropPlot8 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot8,
      {},
    );
    const cropPlot9 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot9,
      {},
    );

    expect(cropPlot1).toBe(true);
    expect(cropPlot2).toBe(true);
    expect(cropPlot3).toBe(true);
    expect(cropPlot4).toBe(true);
    expect(cropPlot5).toBe(true);
    expect(cropPlot6).toBe(true);
    expect(cropPlot7).toBe(true);
    expect(cropPlot8).toBe(true);
    expect(cropPlot9).toBe(true);
  });

  it("returns false if the crop is outside the Laurie the Chuckle Crow AOE", () => {
    const plotOutsideAOE1: Position = { x: -1, y: 0, ...plotDimensions };
    const plotOutsideAOE2: Position = { x: -1, y: -1, ...plotDimensions };
    const plotOutsideAOE3: Position = { x: 1, y: 0, ...plotDimensions };
    const plotOutsideAOE4: Position = { x: 1, y: -1, ...plotDimensions };
    const plotOutsideAOE5: Position = { x: -2, y: 0, ...plotDimensions };
    const plotOutsideAOE6: Position = { x: -2, y: -1, ...plotDimensions };
    const plotOutsideAOE7: Position = { x: -2, y: -2, ...plotDimensions };
    const plotOutsideAOE8: Position = { x: -2, y: -3, ...plotDimensions };
    const plotOutsideAOE9: Position = { x: -2, y: -4, ...plotDimensions };
    const plotOutsideAOE10: Position = { x: 2, y: 0, ...plotDimensions };
    const plotOutsideAOE11: Position = { x: 2, y: -1, ...plotDimensions };
    const plotOutsideAOE12: Position = { x: 2, y: -2, ...plotDimensions };
    const plotOutsideAOE13: Position = { x: 2, y: -3, ...plotDimensions };
    const plotOutsideAOE14: Position = { x: 2, y: -4, ...plotDimensions };

    const cropPlot1 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE1,
      {},
    );
    const cropPlot2 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE2,
      {},
    );

    const cropPlot3 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE3,
      {},
    );

    const cropPlot4 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE4,
      {},
    );

    const cropPlot5 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE5,
      {},
    );

    const cropPlot6 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE6,
      {},
    );

    const cropPlot7 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE7,
      {},
    );

    const cropPlot8 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE8,
      {},
    );

    const cropPlot9 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE9,
      {},
    );

    const cropPlot10 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE10,
      {},
    );

    const cropPlot11 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE11,
      {},
    );

    const cropPlot12 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE12,
      {},
    );

    const cropPlot13 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE13,
      {},
    );

    const cropPlot14 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE14,
      {},
    );

    expect(cropPlot1).toBe(false);
    expect(cropPlot2).toBe(false);
    expect(cropPlot3).toBe(false);
    expect(cropPlot4).toBe(false);
    expect(cropPlot5).toBe(false);
    expect(cropPlot6).toBe(false);
    expect(cropPlot7).toBe(false);
    expect(cropPlot8).toBe(false);
    expect(cropPlot9).toBe(false);
    expect(cropPlot10).toBe(false);
    expect(cropPlot11).toBe(false);
    expect(cropPlot12).toBe(false);
    expect(cropPlot13).toBe(false);
    expect(cropPlot14).toBe(false);
  });

  it("returns true if the rock is within the Emerald Turtle AOE", () => {
    const rockDimensions: Dimensions = { ...RESOURCE_DIMENSIONS["Gold Rock"] };

    const rockPosition1: Position = { x: 1, y: 0, ...rockDimensions };
    const rockPosition2: Position = { x: 1, y: -1, ...rockDimensions };
    const rockPosition3: Position = { x: 0, y: -1, ...rockDimensions };

    const rockPosition4: Position = { x: -1, y: -1, ...rockDimensions };
    const rockPosition5: Position = { x: -1, y: 0, ...rockDimensions };
    const rockPosition6: Position = { x: -1, y: 1, ...rockDimensions };
    const rockPosition7: Position = { x: 0, y: 1, ...rockDimensions };
    const rockPosition8: Position = { x: 1, y: 1, ...rockDimensions };

    const rock1 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition1,
      {},
    );
    const rock2 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition2,
      {},
    );

    const rock3 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition3,
      {},
    );

    const rock4 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition4,
      {},
    );

    const rock5 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition5,
      {},
    );
    const rock6 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition6,
      {},
    );
    const rock7 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition7,
      {},
    );
    const rock8 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition8,
      {},
    );
    expect(rock1).toBe(true);
    expect(rock2).toBe(true);
    expect(rock3).toBe(true);
    expect(rock4).toBe(true);
    expect(rock5).toBe(true);
    expect(rock6).toBe(true);
    expect(rock7).toBe(true);
    expect(rock8).toBe(true);
  });

  it("returns true if the crop is within the Queen Cornelia AOE", () => {
    const plotPositions: Position[] = [
      { x: 1, y: 1, ...plotDimensions },
      { x: 0, y: 1, ...plotDimensions },
      { x: -1, y: 1, ...plotDimensions },
      { x: -1, y: 0, ...plotDimensions },
      { x: -1, y: -1, ...plotDimensions },
      { x: -1, y: -2, ...plotDimensions },
      { x: 0, y: -2, ...plotDimensions },
      { x: 1, y: -2, ...plotDimensions },
      { x: 1, y: -1, ...plotDimensions },
      { x: 1, y: 0, ...plotDimensions },
    ];

    const itemPosition: Position = { x: 0, y: 0, height: 2, width: 1 };

    plotPositions.forEach((plotPosition) => {
      const isPlotWithinAoE = isWithinAOE(
        "Queen Cornelia",
        itemPosition,
        plotPosition,
        {},
      );

      expect(isPlotWithinAoE).toBe(true);
    });
  });

  it("returns false if the crop is outside of the Queen Cornelia AOE", () => {
    const plotPositions: Position[] = [
      { x: 2, y: 2, ...plotDimensions },
      { x: 1, y: 2, ...plotDimensions },
      { x: 0, y: 2, ...plotDimensions },
      { x: -1, y: 2, ...plotDimensions },
      { x: -2, y: 2, ...plotDimensions },
      { x: -2, y: 1, ...plotDimensions },
      { x: -2, y: 0, ...plotDimensions },
      { x: -2, y: -1, ...plotDimensions },
      { x: -2, y: -2, ...plotDimensions },
      { x: -2, y: -3, ...plotDimensions },
      { x: -1, y: -3, ...plotDimensions },
      { x: 0, y: -3, ...plotDimensions },
      { x: 1, y: -3, ...plotDimensions },
      { x: 2, y: -3, ...plotDimensions },
      { x: 2, y: -2, ...plotDimensions },
      { x: 2, y: -1, ...plotDimensions },
      { x: 2, y: 0, ...plotDimensions },
      { x: 2, y: 1, ...plotDimensions },
    ];

    const itemPosition: Position = { x: 0, y: 0, height: 2, width: 1 };

    plotPositions.forEach((plotPosition) => {
      const isPlotWithinAoE = isWithinAOE(
        "Queen Cornelia",
        itemPosition,
        plotPosition,
        {},
      );

      expect(isPlotWithinAoE).toBe(false);
    });
  });

  it("returns true if the crop is within the Gnome AOE", () => {
    const plot: Position = { x: 0, y: -1, ...plotDimensions };

    const cropPlot = isWithinAOE(
      "Gnome",
      { x: 0, y: 0, height: 1, width: 1 },
      plot,
      {},
    );

    expect(cropPlot).toBe(true);
  });

  it("returns false if the crop is within the Gnome AOE", () => {
    const plot: Position = { x: -1, y: -1, ...plotDimensions };

    const cropPlot = isWithinAOE(
      "Gnome",
      { x: 0, y: 0, height: 1, width: 1 },
      plot,
      {},
    );

    expect(cropPlot).toBe(false);
  });

  // Rank-scaled AOE size. The placeable sits at (0, 0) with height 2, so with
  // the bounds formula topLeft = { x: -xLeft, y: -2 }, bottomRight =
  // { x: xRight, y: -2 - (depth - 1) } the footprints are:
  //   base (no skill) {1,1,3} -> x in [-1, 1],  y in [-4,  -2]
  //   rank 1          {3,3,7} -> x in [-3, 3],  y in [-8,  -2]
  //   rank 2          {4,3,8} -> x in [-4, 3],  y in [-9,  -2]  (extra LEFT column)
  //   rank 3          {4,4,9} -> x in [-4, 4],  y in [-10, -2]  (extra RIGHT column)
  describe("rank-scaled AOE size", () => {
    const aoeItem: Position = { x: 0, y: 0, height: 2, width: 1 };
    const tile = (x: number, y: number): Position => ({
      x,
      y,
      height: 1,
      width: 1,
    });

    // [tileX, tileY, rank (0 = no skill), expected]
    const BOUNDARY_CASES: [number, number, number, boolean][] = [
      // x = -2 column: outside the base 3x3, inside from rank 1 upwards.
      [-2, -2, 0, false],
      [-2, -2, 1, true],
      // y = -8 row: deeper than the base footprint, reached from rank 1.
      [0, -8, 0, false],
      [0, -8, 1, true],
      // x = -4 left column: only reachable at rank >= 2.
      [-4, -2, 1, false],
      [-4, -2, 2, true],
      [-4, -2, 3, true],
      // y = -9 row (depth 8): inside at rank 2 & 3, outside at rank 1.
      [0, -9, 1, false],
      [0, -9, 2, true],
      [0, -9, 3, true],
      // x = 4 right column: only reachable at rank 3.
      [4, -2, 1, false],
      [4, -2, 2, false],
      [4, -2, 3, true],
      // y = -10 row (depth 9): inside only at rank 3.
      [0, -10, 1, false],
      [0, -10, 2, false],
      [0, -10, 3, true],
    ];

    it.each(BOUNDARY_CASES)(
      "Basic Scarecrow (Chonky Scarecrow) at rank %#: tile (%i, %i) rank %i -> %s",
      (x, y, rank, expected) => {
        const skills = rank === 0 ? {} : { "Chonky Scarecrow": rank };

        expect(
          isWithinAOE("Basic Scarecrow", aoeItem, tile(x, y), skills),
        ).toBe(expected);
      },
    );

    it.each(BOUNDARY_CASES)(
      "Scary Mike (Horror Mike) at rank %#: tile (%i, %i) rank %i -> %s",
      (x, y, rank, expected) => {
        const skills = rank === 0 ? {} : { "Horror Mike": rank };

        expect(isWithinAOE("Scary Mike", aoeItem, tile(x, y), skills)).toBe(
          expected,
        );
      },
    );

    it.each(BOUNDARY_CASES)(
      "Laurie the Chuckle Crow (Laurie's Gains) at rank %#: tile (%i, %i) rank %i -> %s",
      (x, y, rank, expected) => {
        const skills = rank === 0 ? {} : { "Laurie's Gains": rank };

        expect(
          isWithinAOE("Laurie the Chuckle Crow", aoeItem, tile(x, y), skills),
        ).toBe(expected);
      },
    );
  });
});

describe("detectPetHouseCollision", () => {
  it("detects collision with same-name pet at same coordinates", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.petHouse = {
      ...state.petHouse,
      level: 1,
      pets: {
        Barkley: [
          {
            id: "pet-1",
            readyAt: 0,
            createdAt: 0,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
    };

    const hasCollision = detectCollision({
      state,
      position: { x: 0, y: 0, height: 1, width: 1 },
      location: "petHouse",
      name: "Barkley",
    });

    expect(hasCollision).toBe(true);
  });

  it("allows placing same-name pet at different non-colliding coordinates", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.petHouse = {
      ...state.petHouse,
      level: 1,
      pets: {
        Barkley: [
          {
            id: "pet-1",
            readyAt: 0,
            createdAt: 0,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
    };

    const hasCollision = detectCollision({
      state,
      position: { x: 2, y: 0, height: 1, width: 1 },
      location: "petHouse",
      name: "Barkley",
    });

    expect(hasCollision).toBe(false);
  });

  it("detects collision when placing outside pet house bounds", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.petHouse = {
      ...state.petHouse,
      level: 1,
      pets: {},
    };

    // Level 1 bounds: x: -3 to 4, y: -3 to 3
    const hasCollision = detectCollision({
      state,
      position: { x: 10, y: 10, height: 1, width: 1 },
      location: "petHouse",
      name: "Barkley",
    });

    expect(hasCollision).toBe(true);
  });

  it("detects collision with Pet NFT using 2x2 dimensions", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.petHouse = {
      ...state.petHouse,
      level: 1,
      pets: {},
    };
    state.pets = {
      nfts: {
        1: {
          id: 1,
          name: "Pet #1",
          coordinates: { x: 0, y: 0 },
          location: "petHouse",
          requests: { food: [], fedAt: 0 },
          experience: 0,
          energy: 100,
          pettedAt: 0,
        },
      },
    };

    // Trying to place at x: 1, y: 0 should collide with 2x2 Pet NFT at 0,0
    const hasCollision = detectCollision({
      state,
      position: { x: 1, y: 0, height: 1, width: 1 },
      location: "petHouse",
      name: "Barkley",
    });

    expect(hasCollision).toBe(true);
  });

  it("allows placing outside Pet NFT 2x2 bounds", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.petHouse = {
      ...state.petHouse,
      level: 1,
      pets: {},
    };
    state.pets = {
      nfts: {
        1: {
          id: 1,
          name: "Pet #1",
          coordinates: { x: 0, y: 0 },
          location: "petHouse",
          requests: { food: [], fedAt: 0 },
          experience: 0,
          energy: 100,
          pettedAt: 0,
        },
      },
    };

    // Placing at x: 2, y: 0 should NOT collide with 2x2 Pet NFT at 0,0
    const hasCollision = detectCollision({
      state,
      position: { x: 2, y: 0, height: 1, width: 1 },
      location: "petHouse",
      name: "Barkley",
    });

    expect(hasCollision).toBe(false);
  });
});

describe("detectHomeCollision - same name items", () => {
  it("detects collision with same-name collectible at same coordinates", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.home = {
      collectibles: {
        "Abandoned Bear": [
          {
            id: "123",
            coordinates: { x: 0, y: 0 },
            readyAt: 0,
            createdAt: 0,
          },
        ],
      },
    };

    const hasCollision = detectCollision({
      state,
      position: { x: 0, y: 0, height: 1, width: 1 },
      location: "home",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(true);
  });
});
