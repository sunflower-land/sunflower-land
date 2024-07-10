import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useState } from "react";

const GRID_HEIGHT = 10;
const GRID_WIDTH = 10;

type FormationPlot = { x: number; y: number; name?: InventoryItemName };

type Formation = FormationPlot[];

const SEA_CUCUMBERS: Formation = [
  { x: 0, y: 0, name: "Sea Cucumber" },
  { x: 0, y: -1, name: "Sea Cucumber" },
  { x: 0, y: -2, name: "Starfish" },
];

const SEAWEED: Formation = [
  { x: 0, y: 0, name: "Seaweed" },
  { x: 1, y: 0, name: "Seaweed" },
  { x: 2, y: 0, name: "Seaweed" },
  { x: 3, y: 0, name: "Starfish" },
];

const PIPIS: Formation = [
  { x: 0, y: 0, name: "Pipi" },
  { x: 1, y: 0, name: "Pipi" },
  { x: 0, y: -1, name: "Pipi" },
  { x: 1, y: -1, name: "Pipi" },
];

const BOUNTY: Formation = [{ x: 0, y: 0, name: "Pirate Bounty" }];

const CORAL: Formation = [
  { x: 0, y: 0, name: "Pearl" },
  { x: 1, y: 0, name: "Coral" },
  { x: 2, y: 0, name: "Coral" },
  { x: 3, y: 1, name: "Coral" },
  { x: 3, y: 2, name: "Coral" },
];

type Grid = (InventoryItemName | undefined)[][];

/**
 * Get all the origin points where the formation could be based off
 */
function availablePositions({
  grid,
  formation,
}: {
  grid: Grid;
  formation: Formation;
}): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];

  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      let canPlace = true;

      for (const plot of formation) {
        const newX = x + plot.x;
        const newY = y + plot.y;

        // Check if the new position is within bounds
        if (newX < 0 || newX >= GRID_WIDTH || newY < 0 || newY >= GRID_HEIGHT) {
          canPlace = false;
          break;
        }

        // Check if the cell is already occupied
        if (grid[newX][newY] !== undefined) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        positions.push({ x, y });
      }
    }
  }

  return positions;
}

const CRAB_NAME: InventoryItemName = "Crab";

/**
 * Crabs surround any treasure items
 */
function addCrabs({ grid }: { grid: Grid }) {
  const directions = [
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 }, // right
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 }, // down
  ];

  const newGrid = grid.map((row) => row.slice()); // Create a copy of the grid to avoid mutating the original

  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      if (grid[x][y] !== undefined && grid[x][y] !== CRAB_NAME) {
        directions.forEach(({ dx, dy }) => {
          const newX = x + dx;
          const newY = y + dy;
          if (
            newX >= 0 &&
            newX < GRID_WIDTH &&
            newY >= 0 &&
            newY < GRID_HEIGHT &&
            newGrid[newX][newY] === undefined
          ) {
            newGrid[newX][newY] = CRAB_NAME;
          }
        });
      }
    }
  }

  return newGrid;
}

function addFormation({
  grid,
  formation,
}: {
  grid: Grid;
  formation: Formation;
}) {
  // Find available spots
  const positions = availablePositions({ grid, formation });
  const randomPosition =
    positions[Math.floor(Math.random() * positions.length)];

  // Place the formation
  for (const plot of formation) {
    grid[plot.x + randomPosition.x][plot.y + randomPosition.y] = plot.name;
  }

  return grid;
}

export function createGrid() {
  let grid: Grid = [];

  // Create empty grid
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      grid[x] = grid[x] || [];

      grid[x][y] = undefined;
    }
  }

  grid = addFormation({ grid, formation: SEA_CUCUMBERS });
  grid = addFormation({ grid, formation: SEAWEED });
  grid = addFormation({ grid, formation: PIPIS });
  grid = addCrabs({ grid });
  grid = addFormation({ grid, formation: CORAL });
  grid = addFormation({ grid, formation: BOUNTY });
  grid = addFormation({ grid, formation: SEA_CUCUMBERS });
  grid = addFormation({ grid, formation: SEAWEED });
  grid = addCrabs({ grid });

  return grid;
}

const grid = createGrid();

export const DiggingMinigame: React.FC = () => {
  const [digs, setDigs] = useState<FormationPlot[]>([]);

  const dig = (plot: FormationPlot) => {
    setDigs((digs) => [...digs, plot]);
  };

  return (
    <Modal show>
      <Panel>
        <Label type="default">{`Digs left: ${25 - digs.length}`}</Label>
        {grid.map((row, x) => (
          <div className="flex" key={x}>
            {row.map((item, y) => {
              const hasDug = digs.find((d) => d.x === x && d.y === y);
              return (
                <div
                  className="w-8 h-8 border-2 border-white cursor-pointer hover:bg-slate-400 flex items-center justify-center"
                  key={`${x}-${y}`}
                  onClick={() => dig({ x, y, name: item })}
                >
                  {item && (
                    <img src={ITEM_DETAILS[item].image} className="w-5" />
                  )}
                  {hasDug && !item && (
                    <img src={SUNNYSIDE.icons.close} className="w-5" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </Panel>
    </Modal>
  );
};
