import { GameState } from "features/game/types/game";

export const getSupportedChickens = (state: Readonly<GameState>) => {
  const chickenHouses = state.buildings["Chicken House"]?.length ?? 0;
  const chickenCoop = state.inventory["Chicken Coop"];
  return chickenCoop ? chickenHouses * 10 * 1.5 : chickenHouses * 10;
};
