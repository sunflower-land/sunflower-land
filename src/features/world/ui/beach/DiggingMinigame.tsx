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

// Horizontal Zig Zag - X Coins
const ARTEFACT_1: Formation = [
  { x: 0, y: 0, name: "Camel Bone" },
  { x: 1, y: 0, name: "Camel Bone" },
  { x: 0, y: -1, name: "Camel Bone" },
  { x: 1, y: -1, name: "Scarab" },
];

// Upside T - X Coins
const ARTEFACT_2: Formation = [
  { x: 0, y: 0, name: "Camel Bone" },
  { x: 1, y: 0, name: "Scarab" },
  { x: 2, y: 0, name: "Camel Bone" },
  { x: 1, y: 1, name: "Camel Bone" },
  { x: 1, y: 2, name: "Camel Bone" },
];

// Star - X Coins
const ARTEFACT_3: Formation = [
  { x: 0, y: 0, name: "Camel Bone" },
  { x: 1, y: 1, name: "Camel Bone" },
  { x: 2, y: 0, name: "Camel Bone" },
  { x: 1, y: -1, name: "Camel Bone" },
  { x: 1, y: 0, name: "Scarab" },
];

// Square - X Coins
const ARTEFACT_4: Formation = [
  { x: 0, y: 0, name: "Camel Bone" },
  { x: 1, y: 0, name: "Camel Bone" },
  { x: 0, y: -1, name: "Camel Bone" },
  { x: 1, y: -1, name: "Scarab" },
];

// Horizontal - X Coins
const ARTEFACT_5: Formation = [
  { x: 0, y: 0, name: "Camel Bone" },
  { x: 1, y: 0, name: "Camel Bone" },
  { x: 2, y: 0, name: "Camel Bone" },
  { x: 3, y: 0, name: "Scarab" },
];

// U Shape - X Coins
const ARTEFACT_6: Formation = [
  { x: 0, y: 0, name: "Camel Bone" },
  { x: 0, y: -1, name: "Camel Bone" },
  { x: 1, y: 0, name: "Scarab" },
  { x: 1, y: -1, name: "Camel Bone" },
  { x: 2, y: 0, name: "Camel Bone" },
  { x: 2, y: -1, name: "Camel Bone" },
];

// Horizontal - X Coins
const ARTEFACT_7: Formation = [
  { x: 0, y: 0, name: "Camel Bone" },
  { x: 0, y: -1, name: "Camel Bone" },
  { x: 0, y: -2, name: "Scarab" },
  { x: 0, y: -3, name: "Camel Bone" },
];

// Small L - X Coins
const HIEROGLYPH: Formation = [
  { x: 0, y: 0, name: "Vase" },
  { x: 1, y: 0, name: "Vase" },
  { x: 0, y: 1, name: "Hieroglyph" },
];

// Square - X Coins
const OLD_BOTTLE: Formation = [
  { x: 0, y: 0, name: "Old Bottle" },
  { x: 1, y: 0, name: "Old Bottle" },
  { x: 0, y: 1, name: "Old Bottle" },
  { x: 1, y: 1, name: "Old Bottle" },
];

// Diagonal - X Coins
const COCKLE: Formation = [
  { x: 0, y: 0, name: "Cockle Shell" },
  { x: 1, y: 1, name: "Cockle Shell" },
  { x: 2, y: 2, name: "Cockle Shell" },
];

// Horizontal - X Coins
const WOODEN_COMPASS: Formation = [
  { x: 0, y: 0, name: "Wood" },
  { x: 1, y: 0, name: "Wooden Compass" },
  { x: 2, y: 0, name: "Wood" },
];

const SEA_CUCUMBERS: Formation = [
  { x: 0, y: 0, name: "Sea Cucumber" },
  { x: 1, y: 0, name: "Sea Cucumber" },
  { x: 2, y: 0, name: "Sea Cucumber" },
  { x: 3, y: 0, name: "Pipi" },
];

const SEAWEED: Formation = [
  { x: 0, y: 0, name: "Seaweed" },
  { x: 1, y: 0, name: "Seaweed" },
  { x: 2, y: 0, name: "Seaweed" },
  { x: 2, y: 1, name: "Starfish" },
];

const CLAM_SHELLS: Formation = [
  { x: 0, y: 0, name: "Clam Shell" },
  { x: 1, y: 0, name: "Clam Shell" },
  { x: 0, y: -1, name: "Clam Shell" },
  { x: 1, y: -1, name: "Clam Shell" },
];

const CORAL: Formation = [{ x: 0, y: 0, name: "Coral" }];
const PEARL: Formation = [{ x: 0, y: 0, name: "Pearl" }];
const PIRATE_BOUNTY: Formation = [{ x: 0, y: 0, name: "Pirate Bounty" }];

const GROUP_ONE = [
  ARTEFACT_1,
  HIEROGLYPH,
  ARTEFACT_1,
  COCKLE,
  CLAM_SHELLS,
  ARTEFACT_1,
];

const GROUP_TWO = [
  ARTEFACT_2,
  HIEROGLYPH,
  HIEROGLYPH,
  ARTEFACT_2,
  OLD_BOTTLE,
  SEAWEED,
  ARTEFACT_2,
  CORAL,
];

const GROUP_THREE = [
  ARTEFACT_3,
  HIEROGLYPH,
  ARTEFACT_3,
  OLD_BOTTLE,
  SEA_CUCUMBERS,
  CLAM_SHELLS,
  ARTEFACT_3,
];

const GROUP_FOUR = [
  ARTEFACT_4,
  HIEROGLYPH,
  HIEROGLYPH,
  ARTEFACT_4,
  WOODEN_COMPASS,
  COCKLE,
  SEAWEED,
  ARTEFACT_4,
];

const GROUP_FIVE = [
  ARTEFACT_5,
  HIEROGLYPH,
  ARTEFACT_5,
  CLAM_SHELLS,
  HIEROGLYPH,
  OLD_BOTTLE,
  ARTEFACT_5,
];

const GROUP_SIX = [
  ARTEFACT_6,
  HIEROGLYPH,
  HIEROGLYPH,
  ARTEFACT_6,
  COCKLE,
  OLD_BOTTLE,
  WOODEN_COMPASS,
  ARTEFACT_6,
];

const GROUP_SEVEN = [
  ARTEFACT_7,
  HIEROGLYPH,
  HIEROGLYPH,
  ARTEFACT_7,
  SEAWEED,
  CLAM_SHELLS,
  SEA_CUCUMBERS,
  ARTEFACT_7,
];

const GROUP = GROUP_SEVEN;

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
        if (grid[newX][newY] !== EMPTY_ITEM) {
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

const EMPTY_ITEM: InventoryItemName = "Sand";

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
      if (grid[x][y] !== EMPTY_ITEM && grid[x][y] !== CRAB_NAME) {
        directions.forEach(({ dx, dy }) => {
          const newX = x + dx;
          const newY = y + dy;
          if (
            newX >= 0 &&
            newX < GRID_WIDTH &&
            newY >= 0 &&
            newY < GRID_HEIGHT &&
            newGrid[newX][newY] === EMPTY_ITEM
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

      grid[x][y] = EMPTY_ITEM;
    }
  }

  GROUP.forEach((formation, index) => {
    grid = addFormation({ grid, formation });

    // halfway through loop
    if (index === Math.floor(GROUP.length / 2)) {
      grid = addCrabs({ grid });
    }
  });
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
        <div className="flex">
          {grid.map((row, x) => (
            <div className="flex-col" key={x}>
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
        </div>
      </Panel>
    </Modal>
  );
};
