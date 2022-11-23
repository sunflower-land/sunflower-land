import { getKeys } from "features/game/types/craftables";
import {
  getPlotPositions,
  IslandPlotPositions,
  islandTileType,
} from "./HomeIslandGenerator";

const assertPlotTilesCount = (
  plotPositions: IslandPlotPositions,
  plots: number
) => {
  const xPositions = getKeys(plotPositions);
  const plotCount =
    xPositions.flatMap((x) => {
      const yPositions = getKeys(plotPositions[x]);
      return yPositions.map((y) => {
        return plotPositions[x][y];
      });
    }).length - 2; // minus next plot and dock
  expect(plotCount).toBe(plots);
};
const land: islandTileType = "land";
const next: islandTileType = "next";
const dock: islandTileType = "dock";

describe("getPlotPositions", () => {
  it("generate correct number of land plot", () => {
    const plots = 1984;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
  });
  it("generate correct positions with 1 land plot", () => {
    const plots = 1;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(next);
    expect(plotPositions[0][-1]).toBe(dock);
  });
  it("generate correct positions with 2 land plot", () => {
    const plots = 2;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(next);
    expect(plotPositions[0][-1]).toBe(dock);
  });
  it("generate correct positions with 3 land plot", () => {
    const plots = 3;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(land);
    expect(plotPositions[0][1]).toBe(next);
    expect(plotPositions[0][-1]).toBe(dock);
  });
  it("generate correct positions with 4 land plot", () => {
    const plots = 4;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(land);
    expect(plotPositions[0][1]).toBe(land);
    expect(plotPositions[-1][1]).toBe(next);
    expect(plotPositions[0][-1]).toBe(dock);
  });
  it("generate correct positions with 5 land plot", () => {
    const plots = 5;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(land);
    expect(plotPositions[0][1]).toBe(land);
    expect(plotPositions[-1][1]).toBe(land);
    expect(plotPositions[-1][0]).toBe(next);
    expect(plotPositions[0][-1]).toBe(dock);
  });
  it("generate correct positions with 6 land plot", () => {
    const plots = 6;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(land);
    expect(plotPositions[0][1]).toBe(land);
    expect(plotPositions[-1][1]).toBe(land);
    expect(plotPositions[-1][0]).toBe(land);
    expect(plotPositions[-1][-1]).toBe(next);
    expect(plotPositions[0][-1]).toBe(dock);
  });
  it("generate correct positions with 7 land plot", () => {
    const plots = 7;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(land);
    expect(plotPositions[0][1]).toBe(land);
    expect(plotPositions[-1][1]).toBe(land);
    expect(plotPositions[-1][0]).toBe(land);
    expect(plotPositions[-1][-1]).toBe(land);
    expect(plotPositions[0][-1]).toBe(next);
    expect(plotPositions[-1][-2]).toBe(dock);
  });
  it("generate correct positions with 8 land plot", () => {
    const plots = 8;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(land);
    expect(plotPositions[0][1]).toBe(land);
    expect(plotPositions[-1][1]).toBe(land);
    expect(plotPositions[-1][0]).toBe(land);
    expect(plotPositions[-1][-1]).toBe(land);
    expect(plotPositions[0][-1]).toBe(land);
    expect(plotPositions[1][-1]).toBe(next);
    expect(plotPositions[0][-2]).toBe(dock);
  });
  it("generate correct positions with 9 land plot", () => {
    const plots = 9;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(land);
    expect(plotPositions[0][1]).toBe(land);
    expect(plotPositions[-1][1]).toBe(land);
    expect(plotPositions[-1][0]).toBe(land);
    expect(plotPositions[-1][-1]).toBe(land);
    expect(plotPositions[0][-1]).toBe(land);
    expect(plotPositions[1][-1]).toBe(land);
    expect(plotPositions[2][-1]).toBe(next);
    expect(plotPositions[0][-2]).toBe(dock);
  });
  it("generate correct positions with 10 land plot", () => {
    const plots = 10;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(land);
    expect(plotPositions[0][1]).toBe(land);
    expect(plotPositions[-1][1]).toBe(land);
    expect(plotPositions[-1][0]).toBe(land);
    expect(plotPositions[-1][-1]).toBe(land);
    expect(plotPositions[0][-1]).toBe(land);
    expect(plotPositions[1][-1]).toBe(land);
    expect(plotPositions[2][-1]).toBe(land);
    expect(plotPositions[2][0]).toBe(next);
    expect(plotPositions[0][-2]).toBe(dock);
  });
  it("generate correct positions with 11 land plot", () => {
    const plots = 11;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(land);
    expect(plotPositions[0][1]).toBe(land);
    expect(plotPositions[-1][1]).toBe(land);
    expect(plotPositions[-1][0]).toBe(land);
    expect(plotPositions[-1][-1]).toBe(land);
    expect(plotPositions[0][-1]).toBe(land);
    expect(plotPositions[1][-1]).toBe(land);
    expect(plotPositions[2][-1]).toBe(land);
    expect(plotPositions[2][0]).toBe(land);
    expect(plotPositions[2][1]).toBe(next);
    expect(plotPositions[0][-2]).toBe(dock);
  });
  it("generate correct positions with 12 land plot", () => {
    const plots = 12;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(land);
    expect(plotPositions[0][1]).toBe(land);
    expect(plotPositions[-1][1]).toBe(land);
    expect(plotPositions[-1][0]).toBe(land);
    expect(plotPositions[-1][-1]).toBe(land);
    expect(plotPositions[0][-1]).toBe(land);
    expect(plotPositions[1][-1]).toBe(land);
    expect(plotPositions[2][-1]).toBe(land);
    expect(plotPositions[2][0]).toBe(land);
    expect(plotPositions[2][1]).toBe(land);
    expect(plotPositions[2][2]).toBe(next);
    expect(plotPositions[0][-2]).toBe(dock);
  });
  it("generate correct positions with 13 land plot", () => {
    const plots = 13;
    const plotPositions = getPlotPositions(plots);
    assertPlotTilesCount(plotPositions, plots);
    expect(plotPositions[0][0]).toBe(land);
    expect(plotPositions[1][0]).toBe(land);
    expect(plotPositions[1][1]).toBe(land);
    expect(plotPositions[0][1]).toBe(land);
    expect(plotPositions[-1][1]).toBe(land);
    expect(plotPositions[-1][0]).toBe(land);
    expect(plotPositions[-1][-1]).toBe(land);
    expect(plotPositions[0][-1]).toBe(land);
    expect(plotPositions[1][-1]).toBe(land);
    expect(plotPositions[2][-1]).toBe(land);
    expect(plotPositions[2][0]).toBe(land);
    expect(plotPositions[2][1]).toBe(land);
    expect(plotPositions[2][2]).toBe(land);
    expect(plotPositions[1][2]).toBe(next);
    expect(plotPositions[0][-2]).toBe(dock);
  });
});
