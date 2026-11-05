import { getWorldZoom } from "./worldZoom";

const TILE = 16;
const KINGDOM = { mapWidth: 30 * TILE, mapHeight: 55 * TILE };
const PLAZA = { mapWidth: 55 * TILE, mapHeight: 32 * TILE };
const SMALL_ROOM = { mapWidth: 10 * TILE, mapHeight: 10 * TILE };

describe("getWorldZoom", () => {
  it("keeps zoom 3 on phones", () => {
    expect(
      getWorldZoom({ screenWidth: 390, screenHeight: 844, ...KINGDOM }),
    ).toBe(3);
  });

  it("keeps zoom 4 when the map already fills the screen", () => {
    expect(
      getWorldZoom({ screenWidth: 1920, screenHeight: 1080, ...KINGDOM }),
    ).toBe(4);
    expect(
      getWorldZoom({ screenWidth: 2560, screenHeight: 1440, ...PLAZA }),
    ).toBe(4);
  });

  it("zooms in just enough for a 1080p-sized map to fill a wider screen", () => {
    const zoom = getWorldZoom({
      screenWidth: 2560,
      screenHeight: 1440,
      ...KINGDOM,
    });

    expect(KINGDOM.mapWidth * zoom).toBe(2560);
  });

  it("leaves small rooms at the base zoom", () => {
    expect(
      getWorldZoom({ screenWidth: 2560, screenHeight: 1440, ...SMALL_ROOM }),
    ).toBe(4);
  });
});
