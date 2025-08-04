import { produce } from "immer";
import Decimal from "decimal.js-light";
import { BoostName, GameState } from "features/game/types/game";
import { isWearableActive } from "features/game/lib/wearables";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export function getLavaPitTime({ game }: { game: GameState }) {
  let time = 72 * 60 * 60 * 1000;
  const boostsUsed: BoostName[] = [];

  if (isWearableActive({ name: "Obsidian Necklace", game })) {
    time = time * 0.5;
    // boostsUsed.push("Obsidian Necklace"); // already pushed during start of lava pit
  }

  return { time, boostsUsed };
}

export function getObsidianYield({ game }: { game: GameState }) {
  let amount = 1;
  const boostsUsed: BoostName[] = [];
  if (isCollectibleBuilt({ name: "Obsidian Turtle", game })) {
    amount += 0.5;
    boostsUsed.push("Obsidian Turtle");
  }

  return { amount, boostsUsed };
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
    const { time: lavaPitTime, boostsUsed: lavaPitTimeBoostsUsed } =
      getLavaPitTime({ game: copy });

    if (createdAt - lavaPit.startedAt < lavaPitTime) {
      throw new Error("Lava pit still active");
    }

    lavaPit.startedAt = undefined;
    lavaPit.collectedAt = createdAt;

    const obsidianAmount = copy.inventory["Obsidian"] ?? new Decimal(0);

    const { amount: obsidianYield, boostsUsed: obsidianYieldBoostsUsed } =
      getObsidianYield({ game: copy });
    copy.inventory["Obsidian"] = obsidianAmount.add(obsidianYield);

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: [...lavaPitTimeBoostsUsed, ...obsidianYieldBoostsUsed],
      createdAt,
    });
    return copy;
  });
}
