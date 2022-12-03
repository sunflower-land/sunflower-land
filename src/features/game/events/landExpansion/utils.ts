import { GameState } from "features/game/types/game";

export const getSupportedChickens = (state: Readonly<GameState>) => {
  const henHouses =
    state.buildings["Hen House"]?.filter(
      (building) => building.readyAt < Date.now()
    ).length ?? 0;

  const chickenCoop =
    state.collectibles["Chicken Coop"]?.filter(
      (coop) => coop.readyAt < Date.now()
    ).length ?? 0;

  return chickenCoop ? henHouses * 15 : henHouses * 10;
};
