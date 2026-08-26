import {
  GRID_WIDTH_PX,
  PIXEL_SCALE,
  SQUARE_WIDTH,
} from "features/game/lib/constants";
import {
  getGameboardDimensions,
  getGameboardWorldBounds,
  gridRectToWorld,
  gridToWorld,
  snapToGrid,
  worldToGrid,
  WORLD_TILE,
} from "./coordinates";

describe("coordinates", () => {
  it("uses one source pixel per world unit (GRID_WIDTH_PX / PIXEL_SCALE per tile)", () => {
    expect(WORLD_TILE).toEqual(GRID_WIDTH_PX / PIXEL_SCALE);
    expect(WORLD_TILE).toEqual(SQUARE_WIDTH);
  });

  describe("gridToWorld", () => {
    it("places the origin cell's top-left at the world origin", () => {
      expect(gridToWorld({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    });

    it("matches MapPlacement's calc(50% +/- ...) maths divided by PIXEL_SCALE", () => {
      // MapPlacement: left = GRID_WIDTH_PX*x + PIXEL_SCALE*oX, top = -(GRID_WIDTH_PX*y + PIXEL_SCALE*oY)
      const x = 3;
      const y = 2;
      const oX = 4;
      const oY = -8;

      const expectedLeftCss = GRID_WIDTH_PX * x + PIXEL_SCALE * oX;
      const expectedTopCss = -(GRID_WIDTH_PX * y + PIXEL_SCALE * oY);

      const world = gridToWorld({ x, y, oX, oY });
      expect(world.x).toBeCloseTo(expectedLeftCss / PIXEL_SCALE);
      expect(world.y).toBeCloseTo(expectedTopCss / PIXEL_SCALE);
    });

    it("inverts the y axis (grid +y is up, world +y is down)", () => {
      expect(gridToWorld({ x: 0, y: 5 })).toEqual({ x: 0, y: -80 });
      expect(gridToWorld({ x: 0, y: -2 })).toEqual({ x: 0, y: 32 });
    });
  });

  describe("gridRectToWorld", () => {
    it("anchors at the origin cell's top-left and spans width x height tiles", () => {
      expect(gridRectToWorld({ x: 1, y: 3 }, { width: 2, height: 2 })).toEqual({
        x: 16,
        y: -48,
        width: 32,
        height: 32,
      });
    });
  });

  describe("worldToGrid", () => {
    it("returns the cell containing an interior point", () => {
      expect(worldToGrid({ x: 8, y: 8 })).toEqual({ x: 0, y: 0 });
      expect(worldToGrid({ x: 8, y: -8 })).toEqual({ x: 0, y: 1 });
      expect(worldToGrid({ x: -8, y: 24 })).toEqual({ x: -1, y: -1 });
    });

    it("treats a cell's top-left corner as inside the cell", () => {
      expect(worldToGrid({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
      expect(worldToGrid({ x: 16, y: -16 })).toEqual({ x: 1, y: 1 });
    });

    it("round-trips gridToWorld for whole cells", () => {
      for (const cell of [
        { x: 0, y: 0 },
        { x: 7, y: -3 },
        { x: -5, y: 12 },
      ]) {
        expect(worldToGrid(gridToWorld(cell))).toEqual(cell);
      }
    });
  });

  describe("snapToGrid", () => {
    it("snaps to the containing cell's top-left", () => {
      expect(snapToGrid({ x: 20, y: -3 })).toEqual({ x: 16, y: -16 });
      expect(snapToGrid({ x: -1, y: 1 })).toEqual({ x: -16, y: 0 });
    });
  });

  describe("gameboard", () => {
    it("matches Land.tsx's dimensions formula", () => {
      // offset = ceil(sqrt(expansions) * 10 / 2) * 2, board = 84+offset x 56+offset
      // offset(3) = ceil(17.32 / 2) * 2 = 18; offset(42) = ceil(64.81 / 2) * 2 = 66
      expect(getGameboardDimensions(3)).toEqual({ x: 102, y: 74 });
      expect(getGameboardDimensions(42)).toEqual({ x: 150, y: 122 });
    });

    it("centres the world bounds on the origin", () => {
      const bounds = getGameboardWorldBounds(3);
      expect(bounds.x).toEqual(-bounds.width / 2);
      expect(bounds.y).toEqual(-bounds.height / 2);
      expect(bounds.width).toEqual(102 * WORLD_TILE);
      expect(bounds.height).toEqual(74 * WORLD_TILE);
    });
  });
});
