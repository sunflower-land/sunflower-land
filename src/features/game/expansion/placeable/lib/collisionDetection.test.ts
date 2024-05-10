import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState, Position } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import {
  detectCollision,
  isOverlapping,
  isWithinAOE,
} from "./collisionDetection";
import { Dimensions } from "features/game/types/buildings";

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

  it("returns true if a collision is detected with a corner", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.inventory["Basic Land"] = new Decimal(1);

    const hasCollision = detectCollision({
      state,
      position: {
        x: -3,
        y: 3,
        width: 1,
        height: 1,
      },
      location: "farm",
      name: "Abandoned Bear",
    });

    expect(hasCollision).toBe(true);
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

  it("returns true if a collision is detected with a chicken", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.chickens = {
      0: {
        coordinates: {
          x: 1,
          y: 1,
        },
        multiplier: 1,
      },
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
});

describe("isWithinAOE", () => {
  const GAME_STATE: GameState = {
    ...TEST_FARM,
    balance: new Decimal(0),
    inventory: {},
    crops: {
      0: {
        createdAt: Date.now(),
        height: 1,
        width: 1,
        x: 0,
        y: 0,
        crop: {
          name: "Sunflower",
          plantedAt: 0,
          amount: 1,
        },
      },
    },
    gold: {
      0: {
        height: 1,
        width: 1,
        x: 0,
        y: 0,
        stone: {
          amount: 1,
          minedAt: 0,
        },
      },
    },
  };

  const firstCropId = Object.keys(GAME_STATE.crops)[0];

  const plotDimensions: Dimensions = {
    height: GAME_STATE.crops[firstCropId].height,
    width: GAME_STATE.crops[firstCropId].width,
  };

  const plot1: Position = { x: -1, y: -2, ...plotDimensions };
  const plot2: Position = { x: -1, y: -3, ...plotDimensions };
  const plot3: Position = { x: -1, y: -4, ...plotDimensions };
  const plot4: Position = { x: 0, y: -2, ...plotDimensions };
  const plot5: Position = { x: 0, y: -3, ...plotDimensions };
  const plot6: Position = { x: 0, y: -4, ...plotDimensions };
  const plot7: Position = { x: 1, y: -2, ...plotDimensions };
  const plot8: Position = { x: 1, y: -3, ...plotDimensions };
  const plot9: Position = { x: 1, y: -4, ...plotDimensions };

  it("returns true if the crop is within the Basic Scarecrow AOE", () => {
    const cropPlot1 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot1
    );
    const cropPlot2 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot2
    );

    const cropPlot3 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot3
    );

    const cropPlot4 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot4
    );

    const cropPlot5 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot5
    );
    const cropPlot6 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot6
    );
    const cropPlot7 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot7
    );
    const cropPlot8 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot8
    );
    const cropPlot9 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot9
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

  it("returns false if the crop is outside the Basic Scarecrow AOE", () => {
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
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE1
    );
    const cropPlot2 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE2
    );

    const cropPlot3 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE3
    );

    const cropPlot4 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE4
    );

    const cropPlot5 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE5
    );

    const cropPlot6 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE6
    );

    const cropPlot7 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE7
    );

    const cropPlot8 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE8
    );

    const cropPlot9 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE9
    );

    const cropPlot10 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE10
    );

    const cropPlot11 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE11
    );

    const cropPlot12 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE12
    );

    const cropPlot13 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE13
    );

    const cropPlot14 = isWithinAOE(
      "Basic Scarecrow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE14
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

  it("returns true if the crop is within the Scary Mike AOE", () => {
    const cropPlot1 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot1
    );
    const cropPlot2 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot2
    );

    const cropPlot3 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot3
    );

    const cropPlot4 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot4
    );

    const cropPlot5 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot5
    );
    const cropPlot6 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot6
    );
    const cropPlot7 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot7
    );
    const cropPlot8 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot8
    );
    const cropPlot9 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plot9
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
      plotOutsideAOE1
    );
    const cropPlot2 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE2
    );

    const cropPlot3 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE3
    );

    const cropPlot4 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE4
    );

    const cropPlot5 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE5
    );

    const cropPlot6 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE6
    );

    const cropPlot7 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE7
    );

    const cropPlot8 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE8
    );

    const cropPlot9 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE9
    );

    const cropPlot10 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE10
    );

    const cropPlot11 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE11
    );

    const cropPlot12 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE12
    );

    const cropPlot13 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE13
    );

    const cropPlot14 = isWithinAOE(
      "Scary Mike",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE14
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
      plot1
    );
    const cropPlot2 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot2
    );

    const cropPlot3 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot3
    );

    const cropPlot4 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot4
    );

    const cropPlot5 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot5
    );
    const cropPlot6 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot6
    );
    const cropPlot7 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot7
    );
    const cropPlot8 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot8
    );
    const cropPlot9 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plot9
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
      plotOutsideAOE1
    );
    const cropPlot2 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE2
    );

    const cropPlot3 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE3
    );

    const cropPlot4 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE4
    );

    const cropPlot5 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE5
    );

    const cropPlot6 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE6
    );

    const cropPlot7 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE7
    );

    const cropPlot8 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE8
    );

    const cropPlot9 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE9
    );

    const cropPlot10 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE10
    );

    const cropPlot11 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE11
    );

    const cropPlot12 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE12
    );

    const cropPlot13 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE13
    );

    const cropPlot14 = isWithinAOE(
      "Laurie the Chuckle Crow",
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE14
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
    const rockDimensions: Dimensions = {
      height: GAME_STATE.gold[0].height,
      width: GAME_STATE.gold[0].width,
    };

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
      rockPosition1
    );
    const rock2 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition2
    );

    const rock3 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition3
    );

    const rock4 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition4
    );

    const rock5 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition5
    );
    const rock6 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition6
    );
    const rock7 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition7
    );
    const rock8 = isWithinAOE(
      "Emerald Turtle",
      { x: 0, y: 0, height: 1, width: 1 },
      rockPosition8
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

    plotPositions.forEach((plotPosition, idx) => {
      const isPlotWithinAoE = isWithinAOE(
        "Queen Cornelia",
        itemPosition,
        plotPosition
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

    plotPositions.forEach((plotPosition, idx) => {
      const isPlotWithinAoE = isWithinAOE(
        "Queen Cornelia",
        itemPosition,
        plotPosition
      );

      expect(isPlotWithinAoE).toBe(false);
    });
  });

  it("returns true if the crop is within the Gnome AOE", () => {
    const plot: Position = { x: 0, y: -1, ...plotDimensions };

    const cropPlot = isWithinAOE(
      "Gnome",
      { x: 0, y: 0, height: 1, width: 1 },
      plot
    );

    expect(cropPlot).toBe(true);
  });

  it("returns false if the crop is within the Gnome AOE", () => {
    const plot: Position = { x: -1, y: -1, ...plotDimensions };

    const cropPlot = isWithinAOE(
      "Gnome",
      { x: 0, y: 0, height: 1, width: 1 },
      plot
    );

    expect(cropPlot).toBe(false);
  });
});
