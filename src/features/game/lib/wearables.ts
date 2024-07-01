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
    ...Object.values(game.farmHands.bumpkins).flatMap((bumpkin) =>
      Object.values(bumpkin.equipped),
    ),
  ];

  return equipped.includes(name);
}
