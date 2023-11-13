import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import React from "react";

/**
 * A grid overlay to that allows you to click on grid squares to build an
 * array of clickable coordinates.
 *
 * Render on top of treasure island and click on available sand areas.
 * When done, open the console and copy the last console log.
 *
 * @gridCols number of columns
 * @gridRows number of rows
 */
export const ClickableGridCoordinatesBuilder: React.FC<{
  gridCols: number;
  gridRows: number;
}> = ({ gridCols, gridRows }) => {
  const coordinates: Coordinates[] = [];
  const cols = Array.from({ length: gridCols }, (_, i) => i + 1);
  const rows = Array.from({ length: gridRows }, (_, i) => i + 1);

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: `${gridCols * GRID_WIDTH_PX}px`,
        height: `${gridRows * GRID_WIDTH_PX}px`,
        fontSize: 0,
      }}
    >
      <div id="shovel-grid">
        {rows.map((rowNum) =>
          cols.map((colNum) => {
            const planeOffset = 1;
            const midX = gridCols / 2 + planeOffset;
            const midY = gridRows / 2 + planeOffset;
            const x =
              colNum < midX
                ? -Math.abs(colNum - midX)
                : Math.abs(colNum - midX);
            const y =
              rowNum < midY
                ? Math.abs(rowNum - midY)
                : -Math.abs(rowNum - midY);

            return (
              <div
                className="cursor-pointer"
                key={`${colNum} + ${rowNum}`}
                style={{
                  boxSizing: "border-box",
                  display: "inline-block",
                  border: "1px solid black",
                  height: GRID_WIDTH_PX,
                  width: GRID_WIDTH_PX,
                  fontFamily: "sans-serif",
                  fontSize: "10px",
                }}
                onClick={() => {
                  coordinates.push({ x, y });

                  // eslint-disable-next-line no-console
                  console.log(coordinates);
                }}
              >{`${x}, ${y}`}</div>
            );
          })
        )}
      </div>
    </div>
  );
};
