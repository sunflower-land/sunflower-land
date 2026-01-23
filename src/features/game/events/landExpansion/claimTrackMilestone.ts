import Decimal from "decimal.js-light";
import { produce } from "immer";
import { GameState, InventoryItemName } from "../../types/game";
import { CHAPTER_TRACKS, TrackName } from "features/game/types/tracks";
import {
  getChapterTicket,
  getCurrentChapter,
} from "features/game/types/chapters";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { BumpkinItem } from "features/game/types/bumpkin";
import { getObjectEntries } from "features/game/expansion/lib/utils";

export type ClaimTrackMilestoneAction = {
  type: "trackMilestone.claimed";
  track: TrackName;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimTrackMilestoneAction;
  createdAt?: number;
};

export function claimTrackMilestone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const chapter = getCurrentChapter(createdAt);
    const ticket = getChapterTicket(createdAt);
    const nextMilestone =
      game.farmActivity[`${chapter} ${action.track} Milestone Claimed`] ?? 0;

    const points = game.farmActivity[`${ticket} Collected`] ?? 0;

    const chapterTrack = CHAPTER_TRACKS[chapter];

    if (!chapterTrack) {
      throw new Error("Track does not exist");
    }

    if (nextMilestone >= chapterTrack.milestones.length) {
      throw new Error("Milestone does not exist");
    }

    const track = chapterTrack.milestones[nextMilestone];

    if (points < track.points) {
      throw new Error(
        `You do not meet the requirements for milestone ${nextMilestone + 1}`,
      );
    }

    if (action.track === "premium" && !hasVipAccess({ game, now: createdAt })) {
      throw new Error("VIP is required");
    }

    const rewards = track[action.track];

    if (rewards.items) {
      getObjectEntries(rewards.items).forEach(([item, amount]) => {
        if (!amount) return;

        const name = item as InventoryItemName;
        const previous = game.inventory[name] ?? new Decimal(0);
        game.inventory[name] = previous.add(new Decimal(amount));
      });
    }

    if (rewards.wearables) {
      getObjectEntries(rewards.wearables).forEach(([wearable, amount]) => {
        if (!amount) return;

        const previous = game.wardrobe[wearable as BumpkinItem] ?? 0;
        game.wardrobe[wearable as BumpkinItem] = previous + amount;
      });
    }

    if (rewards.coins) {
      game.coins += rewards.coins;
    }

    if (rewards.flower) {
      game.balance = game.balance.add(new Decimal(rewards.flower));
    }

    game.farmActivity = trackFarmActivity(
      `${chapter} ${action.track} Milestone Claimed`,
      game.farmActivity,
    );

    return game;
  });
}
