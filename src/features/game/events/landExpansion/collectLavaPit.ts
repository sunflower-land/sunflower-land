import { produce } from "immer";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { isWearableActive } from "features/game/lib/wearables";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

export function getLavaPitTime({ game }: { game: GameState }) {
  const time = 72 * 60 * 60 * 1000;

  if (isWearableActive({ name: "Obsidian Necklace", game })) {
    return time * 0.5;
  }

  return time;
}

export function getObsidianYield({ game }: { game: GameState }) {
  let amount = 1;
  if (isCollectibleBuilt({ name: "Obsidian Turtle", game })) {
    amount += 0.5;
  }

  return amount;
}

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
    const lavaPitTime = getLavaPitTime({ game: copy });

    if (createdAt - lavaPit.startedAt < lavaPitTime) {
      throw new Error("Lava pit still active");
    }

    lavaPit.startedAt = undefined;
    lavaPit.collectedAt = createdAt;

    const obsidianAmount = copy.inventory["Obsidian"] ?? new Decimal(0);

    const obsidianYield = getObsidianYield({ game: copy });
    copy.inventory["Obsidian"] = obsidianAmount.add(obsidianYield);

    return copy;
  });
}
