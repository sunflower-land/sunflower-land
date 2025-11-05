import { BumpkinItem } from "../types/bumpkin";
import type { GameState } from "../types/game";

type BumpkinEquipped = GameState["bumpkin"]["equipped"];
type FarmHands = GameState["farmHands"];

export function isWearableActive({
  name,
  bumpkinEquipped,
  farmHands,
}: {
  name: BumpkinItem;
  bumpkinEquipped: BumpkinEquipped;
  farmHands: FarmHands;
}) {
  const equipped = [
    ...Object.values(bumpkinEquipped ?? {}),
    ...Object.values(farmHands.bumpkins).flatMap((bumpkin) =>
      Object.values(bumpkin.equipped),
    ),
  ];

  return equipped.includes(name);
}
