export type islandTileType = "land" | "next" | "dock";

/**
 * X + Y Coordinates
 * { 1: { 2: true} , 2: { 2: true, 3: true }}
 */
export type IslandPlotPositions = Record<
  number,
  Record<number, islandTileType>
>;

/**
 * Get the position of land plots, next plot and dock.
 * @param plots the number of plots the island currently has.
 */
export const getPlotPositions = (plots: number): IslandPlotPositions => {
  const plotPositions: IslandPlotPositions = {};

  let minY = 0;
  let x = 0;
  let y = 0;
  let dx = 0;
  let dy = -1;

  // generate land plots
  for (let i = 0; i < plots; i++) {
    if (!plotPositions[x]) {
      plotPositions[x] = {};
    }
    plotPositions[x][y] = "land";

    // traverse through an outward spiral pattern
    if (x == y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
      const t = dx;
      dx = -dy;
      dy = t;
    }
    x = x + dx;
    y = y + dy;
    minY = Math.min(minY, y);
  }

  // the end of the spiral is the next plot
  if (!plotPositions[x]) {
    plotPositions[x] = {};
  }
  plotPositions[x][y] = "next";

  // place dock at bottom of the island as close to the center as possible
  let dockY = minY - 1;
  let dockX = 0;
  // snap dock to bottom of island
  if (!plotPositions[dockX]?.[dockY + 1]) {
    dockY += 1;
  }
  // move dock to the left if the next plot is directly above it
  else if (plotPositions[dockX]?.[dockY + 1] === "next") {
    dockX -= 1;
  }
  if (!plotPositions[dockX]) {
    plotPositions[dockX] = {};
  }
  plotPositions[dockX][dockY] = "dock";

  return plotPositions;
};
