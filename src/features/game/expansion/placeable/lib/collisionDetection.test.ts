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

    const position: Position = { x: 0, y: 0, height: 1, width: 1 };

    const hasCollision = detectCollision(state, position);

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

    const hasCollision = detectCollision(state, position);

    expect(hasCollision).toBe(true);
  });

  it("returns true if a collision is detected with water", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.inventory["Basic Land"] = new Decimal(1);

    const hasCollision = detectCollision(state, {
      x: -4,
      y: 0,
      width: 2,
      height: 1,
    });

    expect(hasCollision).toBe(true);
  });

  it("returns true if a collision is detected with a corner", () => {
    const state: GameState = cloneDeep(TEST_FARM);
    state.inventory["Basic Land"] = new Decimal(1);

    const hasCollision = detectCollision(state, {
      x: -3,
      y: 3,
      width: 1,
      height: 1,
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

    const hasCollision = detectCollision(state, {
      x: 3,
      y: 3,
      height: 1,
      width: 1,
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

    const hasCollision = detectCollision(state, {
      x: 1,
      y: 1,
      height: 1,
      width: 1,
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

    const hasCollision = detectCollision(state, {
      x: 1,
      y: 1,
      height: 1,
      width: 1,
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
        },
      },
    },
  };

  const firstCropId = Object.keys(GAME_STATE.crops)[0];

  const dateNow = Date.now();
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

  it("returns true if the crop is within the AOE", () => {
    const cropPlot1 = isWithinAOE({ x: 0, y: 0, height: 2, width: 1 }, plot1);
    const cropPlot2 = isWithinAOE({ x: 0, y: 0, height: 2, width: 1 }, plot2);

    const cropPlot3 = isWithinAOE({ x: 0, y: 0, height: 2, width: 1 }, plot3);

    const cropPlot4 = isWithinAOE({ x: 0, y: 0, height: 2, width: 1 }, plot4);

    const cropPlot5 = isWithinAOE({ x: 0, y: 0, height: 2, width: 1 }, plot5);
    const cropPlot6 = isWithinAOE({ x: 0, y: 0, height: 2, width: 1 }, plot6);
    const cropPlot7 = isWithinAOE({ x: 0, y: 0, height: 2, width: 1 }, plot7);
    const cropPlot8 = isWithinAOE({ x: 0, y: 0, height: 2, width: 1 }, plot8);
    const cropPlot9 = isWithinAOE({ x: 0, y: 0, height: 2, width: 1 }, plot9);

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

  it("returns false if the crop is outside the AOE", () => {
    const plotOutsideAOE2 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE2.x = -1;
    plotOutsideAOE2.y = 0;

    const plotOutsideAOE1 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE1.x = -1;
    plotOutsideAOE1.y = -1;

    const plotOutsideAOE3 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE3.x = 1;
    plotOutsideAOE3.y = 0;

    const plotOutsideAOE4 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE4.x = 1;
    plotOutsideAOE4.y = -1;

    const plotOutsideAOE5 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE5.x = -2;
    plotOutsideAOE5.y = 0;

    const plotOutsideAOE6 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE6.x = -2;
    plotOutsideAOE6.y = -1;

    const plotOutsideAOE7 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE7.x = -2;
    plotOutsideAOE7.y = -2;

    const plotOutsideAOE8 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE8.x = -2;
    plotOutsideAOE8.y = -3;

    const plotOutsideAOE9 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE9.x = -2;
    plotOutsideAOE9.y = -4;

    const plotOutsideAOE10 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE10.x = 2;
    plotOutsideAOE10.y = 0;

    const plotOutsideAOE11 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE11.x = 2;
    plotOutsideAOE11.y = -1;

    const plotOutsideAOE12 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE12.x = 2;
    plotOutsideAOE12.y = -2;

    const plotOutsideAOE13 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE13.x = 2;
    plotOutsideAOE13.y = -3;

    const plotOutsideAOE14 = GAME_STATE.crops[firstCropId];
    plotOutsideAOE14.x = 2;
    plotOutsideAOE14.y = -4;

    const cropPlot1 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE1
    );
    const cropPlot2 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE2
    );

    const cropPlot3 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE3
    );

    const cropPlot4 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE4
    );

    const cropPlot5 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE5
    );

    const cropPlot6 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE6
    );

    const cropPlot7 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE7
    );

    const cropPlot8 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE8
    );

    const cropPlot9 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE9
    );

    const cropPlot10 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE10
    );

    const cropPlot11 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE11
    );

    const cropPlot12 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE12
    );

    const cropPlot13 = isWithinAOE(
      { x: 0, y: 0, height: 2, width: 1 },
      plotOutsideAOE13
    );

    const cropPlot14 = isWithinAOE(
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
});
