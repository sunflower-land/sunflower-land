import { BumpkinItem } from "../types/bumpkin";
import { GameState } from "../types/game";

export function isWearableActive({
  game,
  name,
}: {
  game: GameState;
  name: BumpkinItem;
}) {
  const equipped = [
    ...Object.values(game.bumpkin?.equipped ?? {}),
    ...Object.values(game.farmHands.bumpkins).reduce(
      (acc, f) => [...acc, ...Object.values(f.equipped)],
      [] as BumpkinItem[]
    ),
  ];

  return equipped.includes(name);
}
