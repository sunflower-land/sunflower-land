import { GameState } from "features/game/types/game";

export function hasPlacedAgingShed(game: GameState): boolean {
  const sheds = game.buildings["Aging Shed"] ?? [];

  return sheds.some((b) => b.coordinates !== undefined);
}
