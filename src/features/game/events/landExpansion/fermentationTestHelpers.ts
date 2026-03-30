import {
  INITIAL_AGING_SHED,
  INITIAL_BUMPKIN,
  TEST_FARM,
} from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

export const FERMENTATION_TEST_NOW = Date.now();

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
    agingShed: INITIAL_AGING_SHED,
    inventory: {},
    ...overrides,
  };
}
