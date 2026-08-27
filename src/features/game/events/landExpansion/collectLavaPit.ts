import { produce } from "immer";
import Decimal from "decimal.js-light";
import type { BoostName, GameState } from "features/game/types/game";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getLavaPitTime } from "./startLavaPit";
import { trackFarmActivity } from "features/game/types/farmActivity";

export function getObsidianYield({ game }: { game: GameState }) {
  let amount = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];
  if (isCollectibleBuilt({ name: "Obsidian Turtle", game })) {
    amount += 0.5;
    boostsUsed.push({ name: "Obsidian Turtle", value: "+0.5" });
  }

  if (isCollectibleBuilt({ name: "Magma Stone", game })) {
    amount += 0.15;
    boostsUsed.push({ name: "Magma Stone", value: "+0.15" });
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

    // `readyAt` is the snapshot taken when the burn started and is authoritative
    // in BOTH directions: equipping the Obsidian Necklace mid-burn must not bring
    // the pit forward, and taking it off must not push it back out to 72h. It
    // applies from the next burn, not this one. Pits started before `readyAt`
    // existed (#6287) carry no snapshot, and are the only case where deriving the
    // duration from current state is the right answer.
    const isReady =
      lavaPit.readyAt !== undefined
        ? createdAt >= lavaPit.readyAt
        : createdAt - lavaPit.startedAt >= lavaPitTime;

    if (!isReady) {
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

    copy.farmActivity = trackFarmActivity(
      "Obsidian Collected",
      copy.farmActivity,
    );

    return copy;
  });
}
