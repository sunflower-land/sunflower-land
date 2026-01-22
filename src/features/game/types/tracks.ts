import { ChapterName } from "./chapters";
import { InventoryItemName, Wardrobe } from "./game";

export type MilestoneRewards = {
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Wardrobe;
  coins?: number;
  flower?: number;
};

export type TrackName = "free" | "premium";

export type TrackMilestone = {
  points: number;
} & Record<TrackName, MilestoneRewards>;

export type ChapterTrack = {
  milestones: TrackMilestone[];
};

const PAW_PRINTS_CHAPTER_TRACKS: ChapterTrack = {
  milestones: [
    /*
	Free Track	Val	VIP Track
170	Ticket Totem	10	Fish Hook Hat
350	Casual Raffle 10	1	Treasure Key
530	Treasure Key	5	Tickets 10
720	Coins 500	1.5	Flower 5
920	Crabs & Fish Rug	10	Rare Key
*/
    {
      points: 170,
      free: {
        items: { "Bronze Food Box": 1 },
      },
      premium: {
        items: { "Bronze Tool Box": 1 },
      },
    },
    {
      points: 350,
      free: {
        items: { "Paw Prints Raffle Ticket": 10 },
      },
      premium: {
        items: { "Treasure Key": 1 },
      },
    },
    {
      points: 530,
      free: {
        items: { "Treasure Key": 1 },
      },
      premium: {
        items: { "Paw Prints Raffle Ticket": 100 },
      },
    },
    {
      points: 720,
      free: {
        coins: 500,
      },
      premium: {
        flower: 5,
      },
    },
    {
      points: 920,
      free: {
        items: { "Paw Prints Rug": 1 },
      },
      premium: {
        items: { "Rare Key": 1 },
      },
    },
  ],
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
