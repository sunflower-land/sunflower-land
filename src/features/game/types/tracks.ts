import { ChapterName } from "./chapters";
import { InventoryItemName, Wardrobe } from "./game";

export type MilestoneRewards = {
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Wardrobe;
};

export type TrackName = "free" | "premium";

export type TrackMilestone = {
  points: number;
} & Record<TrackName, MilestoneRewards>;

export type ChapterTrack = {
  milestones: TrackMilestone[];
};

const PAW_PRINTS_CHAPTER_TRACKS: ChapterTrack = {
  milestones: new Array(32)
    .fill({
      points: 0,
      free: {
        items: {
          "Bronze Tool Box": 1,
        },
        wearables: {},
      },
      premium: {
        items: {
          "Bronze Food Box": 1,
        },
        wearables: {},
      },
    })
    .map((milestone, index) => ({
      ...milestone,
      points: 100 + index * 100,
    })),
};

const TEST_CHAPTER_TRACK: ChapterTrack = {
  milestones: [
    {
      points: 50,
      free: {
        items: { Gold: 1 },
      },
      premium: {
        items: { Crimstone: 1 },
      },
    },
    {
      points: 150,
      free: {
        wearables: { "Acorn Hat": 1 },
      },
      premium: {
        items: { Iron: 1 },
      },
    },
  ],
};

export const CHAPTER_TRACKS: Partial<Record<ChapterName, ChapterTrack>> = {
  // We keep this one for testing
  "Better Together": TEST_CHAPTER_TRACK,

  // Beta testing track
  "Paw Prints": PAW_PRINTS_CHAPTER_TRACKS,
};
