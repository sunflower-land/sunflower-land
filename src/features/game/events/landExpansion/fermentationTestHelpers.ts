import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import { GameState } from "features/game/types/game";

/** Fixed epoch for reproducible fermentation tests. */
export const FERMENTATION_TEST_NOW = 1_700_000_000_000;

export const placedAgingShedBuildings: GameState["buildings"] = {
  "Aging Shed": [
    {
      id: "aging-shed-1",
      coordinates: { x: 0, y: 0 },
      createdAt: FERMENTATION_TEST_NOW,
    },
  ],
};

export function createFermentationTestState(
  overrides: Partial<GameState> = {},
): GameState {
  return {
    ...TEST_FARM,
    bumpkin: INITIAL_BUMPKIN,
    buildings: placedAgingShedBuildings,
    agingShed: createInitialAgingShed(),
    inventory: {},
    ...overrides,
  };
}
