import { produce } from "immer";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

export type CollectLavaPitAction = {
  type: "lavaPit.collected";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectLavaPitAction;
  createdAt?: number;
};

export function collectLavaPit({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (copy) => {
    const lavaPit = copy.lavaPits[action.id];

    if (!lavaPit) {
      throw new Error("Lava pit not found");
    }

    if (lavaPit.startedAt === undefined) {
      throw new Error("Lava pit not started");
    }

    if (lavaPit.collectedAt !== undefined) {
      throw new Error("Lava pit already collected");
    }

    if (createdAt - lavaPit.startedAt < 72 * 60 * 60 * 1000) {
      throw new Error("Lava pit still active");
    }

    lavaPit.startedAt = undefined;
    lavaPit.collectedAt = createdAt;

    const obsidianAmount = copy.inventory["Obsidian"] ?? new Decimal(0);

    copy.inventory["Obsidian"] = obsidianAmount.add(1);

    return copy;
  });
}
