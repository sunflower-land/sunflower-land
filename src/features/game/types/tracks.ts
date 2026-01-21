import { ChapterName } from "./chapters";
import { InventoryItemName, Wardrobe } from "./game";

export type TrackMilestone = {
  points: number;

  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Wardrobe;
};

export type Track = {
  milestones: TrackMilestone[];
};

export type ChapterTrack = {
  free: Track;
  premium: Track;
};

const PAW_PRINTS_CHAPTER_TRACKS: ChapterTrack = {
  free: {
    milestones: [
      {
        points: 100,
        items: { Gold: 1 },
      },
      {
        points: 200,
        items: { "Paw Prints Raffle Ticket": 100 },
      },
      {
        points: 300,
        items: {},
        wearables: { "Acorn Hat": 1 },
      },
      {
        points: 400,
        items: { "Bronze Food Box": 1 },
        wearables: {},
      },
      {
        points: 500,
        items: { "Bronze Food Box": 1 },
        wearables: {},
      },
      {
        points: 600,
        items: { "Bronze Food Box": 1 },
        wearables: {},
      },
      {
        points: 700,
        items: { "Bronze Food Box": 1 },
        wearables: {},
      },
      {
        points: 800,
        items: { "Bronze Food Box": 1 },
        wearables: {},
      },
    ],
  },
  premium: {
    milestones: new Array(32).fill({
      points: 0,
      items: {
        "Bronze Food Box": 1,
      },
      wearables: {},
    }),
  },
};

export const CHAPTER_TRACKS: Partial<Record<ChapterName, ChapterTrack>> = {
  "Paw Prints": PAW_PRINTS_CHAPTER_TRACKS,
};
