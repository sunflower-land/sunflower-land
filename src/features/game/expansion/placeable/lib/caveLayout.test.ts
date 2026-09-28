import {
  CAVE_MACHINE_SIZE,
  CAVE_PATCH_SIZE,
  CAVE_ROOM_TOP_Y,
  CAVE_SLOTS,
  caveSlotsForTier,
  getCaveRoomBounds,
  type CaveCoordinates,
} from "./caveLayout";

const TIERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Every cell a footprint covers: (x, y) is the top-left tile, y counts up.
const cells = ({ x, y }: CaveCoordinates, width: number, height: number) =>
  Array.from({ length: width * height }, (_, i) => ({
    x: x + (i % width),
    y: y - Math.floor(i / width),
  }));

const slotCells = (id: number) => [
  ...cells(CAVE_SLOTS[id].patch, CAVE_PATCH_SIZE, CAVE_PATCH_SIZE),
  ...cells(
    CAVE_SLOTS[id].machine,
    CAVE_MACHINE_SIZE.width,
    CAVE_MACHINE_SIZE.height,
  ),
];

describe("caveLayout", () => {
  it("has eight slots, one per tier", () => {
    expect(Object.keys(CAVE_SLOTS).map(Number)).toEqual(TIERS);
    expect(caveSlotsForTier(8)).toEqual(TIERS);
  });

  it("gives every slot a 25-tile patch", () => {
    for (const id of TIERS) {
      const patch = cells(
        CAVE_SLOTS[id].patch,
        CAVE_PATCH_SIZE,
        CAVE_PATCH_SIZE,
      );
      expect(new Set(patch.map(({ x, y }) => `${x},${y}`)).size).toBe(25);
    }
  });

  it("never overlaps patches or machines", () => {
    const all = TIERS.flatMap(slotCells).map(({ x, y }) => `${x},${y}`);
    expect(new Set(all).size).toBe(all.length);
  });

  it("fits every slot inside the room from the tier that unlocks it", () => {
    for (const id of TIERS) {
      for (const tier of TIERS.filter((t) => t >= id)) {
        const { width, height } = getCaveRoomBounds(tier);
        for (const { x, y } of slotCells(id)) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThan(width);
          expect(CAVE_ROOM_TOP_Y - y).toBeGreaterThanOrEqual(0);
          expect(CAVE_ROOM_TOP_Y - y).toBeLessThan(height);
        }
      }
    }
  });

  it("only grows the room as tiers unlock", () => {
    for (const tier of TIERS.slice(1)) {
      const before = getCaveRoomBounds(tier - 1);
      const after = getCaveRoomBounds(tier);
      expect(after.width).toBeGreaterThanOrEqual(before.width);
      expect(after.height).toBeGreaterThanOrEqual(before.height);
    }
  });

  it("leaves the next slot outside the room until its tier", () => {
    for (const tier of [1, 2, 3, 4]) {
      const { width, height } = getCaveRoomBounds(tier);
      const outside = slotCells(tier + 1).some(
        ({ x, y }) => x >= width || CAVE_ROOM_TOP_Y - y >= height,
      );
      expect(outside).toBe(true);
    }
  });
});
