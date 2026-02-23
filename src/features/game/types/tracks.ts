import { ChapterName } from "./chapters";
import { InventoryItemName, Wardrobe } from "./game";

export type MilestoneRewards = {
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Wardrobe;
  coins?: number;
  flower?: number;
};

export type ChapterTask = "delivery" | "chore" | "bounty" | "coinDelivery";

const CHAPTER_TASK_POINTS: Record<ChapterTask, number> = {
  delivery: 5,
  bounty: 3,
  chore: 1,
  coinDelivery: 1,
};

export function getChapterTaskPoints({
  task,
  points,
}: {
  task: ChapterTask;
  points: number;
}) {
  return CHAPTER_TASK_POINTS[task] * points;
}

export function getTrackMilestonesCrossed({
  chapterTrack,
  previousPoints,
  nextPoints,
}: {
  chapterTrack: ChapterTrack;
  previousPoints: number;
  nextPoints: number;
}) {
  return chapterTrack.milestones
    .map((milestone, index) => ({ milestone, index }))
    .filter(
      ({ milestone }) =>
        milestone.points > previousPoints && milestone.points <= nextPoints,
    )
    .map(({ index }) => index + 1);
}

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

const CRABS_AND_TRAPS_CHAPTER_TRACKS: ChapterTrack = {
  milestones: [
    // Milestone 1
    {
      points: 330,
      free: {
        items: { "Gourmet Hourglass": 1 },
      },
      premium: {
        wearables: { "Fish Hook Hat": 1 },
      },
    },
    // Milestone 2
    {
      points: 670,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        wearables: { "Walrus Onesie": 1 },
      },
    },
    // Milestone 3
    {
      points: 1030,
      free: {
        items: { "Treasure Key": 1 },
      },
      premium: {
        items: { Floater: 10 },
      },
    },
    // Milestone 4
    {
      points: 1400,
      free: {
        coins: 500,
      },
      premium: {
        flower: 5,
      },
    },
    // Milestone 5
    {
      points: 1790,
      free: {
        items: { "Crabs and Fish Rug": 1 },
      },
      premium: {
        items: { "Silver Tool Box": 1 },
      },
    },
    // Milestone 6
    {
      points: 2190,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        coins: 5000,
      },
    },
    // Milestone 7
    {
      points: 2610,
      free: {
        coins: 500,
      },
      premium: {
        items: { "Ore Hourglass": 1 },
      },
    },
    // Milestone 8
    {
      points: 3040,
      free: {
        items: { "Treasure Key": 1 },
      },
      premium: {
        items: { Floater: 10 },
      },
    },
    // Milestone 9
    {
      points: 3490,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 20 },
      },
      premium: {
        items: { Floater: 10 },
      },
    },
    // Milestone 10
    {
      points: 3960,
      free: {
        flower: 1,
      },
      premium: {
        items: { "Diving Helmet": 1 },
      },
    },
    // Milestone 11
    {
      points: 4450,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        items: { Floater: 10 },
      },
    },
    // Milestone 12
    {
      points: 4960,
      free: {
        items: { "Harvest Hourglass": 1 },
      },
      premium: {
        coins: 500,
      },
    },
    // Milestone 13
    {
      points: 5490,
      free: {
        coins: 500,
      },
      premium: {
        flower: 5,
      },
    },
    // Milestone 14
    {
      points: 6040,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        items: { "Timber Hourglass": 1 },
      },
    },
    // Milestone 15
    {
      points: 6610,
      free: {
        items: { "Rare Key": 1 },
      },
      premium: {
        items: { "Silver Tool Box": 1 },
      },
    },
    // Milestone 16
    {
      points: 7200,
      free: {
        coins: 500,
      },
      premium: {
        items: { Floater: 50 },
      },
    },
    // Milestone 17
    {
      points: 7820,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 20 },
      },
      premium: {
        items: { Floater: 50 },
      },
    },
    // Milestone 18
    {
      points: 8460,
      free: {
        coins: 5000,
      },
      premium: {
        coins: 500,
      },
    },
    // Milestone 19
    {
      points: 9130,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        items: { "Silver Flower Box": 1 },
      },
    },
    // Milestone 20
    {
      points: 9830,
      free: {
        items: { "Bronze Flower Box": 1 },
      },
      premium: {
        items: { "Pearl Bed": 1 },
      },
    },
    // Milestone 21
    {
      points: 10550,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        items: { "Orchard Hourglass": 1 },
      },
    },
    // Milestone 22
    {
      points: 11300,
      free: {
        flower: 1,
      },
      premium: {
        items: { Floater: 50 },
      },
    },
    // Milestone 23
    {
      points: 12080,
      free: {
        items: { "Fish Drying Rack": 1 },
      },
      premium: {
        flower: 5,
      },
    },
    // Milestone 24
    {
      points: 12890,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        items: { Floater: 50 },
      },
    },
    // Milestone 25
    {
      points: 13740,
      free: {
        items: { "Timber Hourglass": 1 },
      },
      premium: {
        items: { "Blossom Hourglass": 1 },
      },
    },
    // Milestone 26
    {
      points: 14620,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        items: { Floater: 50 },
      },
    },
    // Milestone 27
    {
      points: 15530,
      free: {
        coins: 500,
      },
      premium: {
        coins: 500,
      },
    },
    // Milestone 28
    {
      points: 16480,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        items: { "Harvest Hourglass": 1 },
      },
    },
    // Milestone 29
    {
      points: 17470,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 20 },
      },
      premium: {
        items: { Floater: 50 },
      },
    },
    // Milestone 30
    {
      points: 18500,
      free: {
        items: { "Fish Flags": 1 },
      },
      premium: {
        items: { "Yellow Submarine Trophy": 1 },
      },
    },
    // Milestone 31
    {
      points: 19570,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        items: { Floater: 100 },
      },
    },
    // Milestone 32
    {
      points: 20680,
      free: {
        flower: 5,
      },
      premium: {
        items: { Floater: 100 },
      },
    },
    // Milestone 33
    {
      points: 21840,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        coins: 5000,
      },
    },
    // Milestone 34
    {
      points: 23040,
      free: {
        items: { "Treasure Key": 1 },
      },
      premium: {
        items: { Floater: 100 },
      },
    },
    // Milestone 35
    {
      points: 24290,
      free: {
        items: { "Ore Hourglass": 1 },
      },
      premium: {
        items: { "Dark Eyed Kissing Fish": 1 },
      },
    },
    // Milestone 36
    {
      points: 25590,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 10 },
      },
      premium: {
        items: { "Orchard Hourglass": 1 },
      },
    },
    // Milestone 37
    {
      points: 26940,
      free: {
        coins: 500,
      },
      premium: {
        items: { "Silver Flower Box": 1 },
      },
    },
    // Milestone 38
    {
      points: 28350,
      free: {
        items: { "Crabs and Traps Raffle Ticket": 30 },
      },
      premium: {
        items: { Floater: 100 },
      },
    },
    // Milestone 39
    {
      points: 29810,
      free: {
        flower: 10,
      },
      premium: {
        coins: 5000,
      },
    },
    // Milestone 40
    {
      points: 31330,
      free: {
        items: { Oaken: 1 },
      },
      premium: {
        items: { "Pet Egg": 1 },
      },
    },
  ],
};

export const CHAPTER_TRACKS: Partial<Record<ChapterName, ChapterTrack>> = {
  // We keep this one for testing
  "Better Together": TEST_CHAPTER_TRACK,

  // Beta testing track
  "Paw Prints": PAW_PRINTS_CHAPTER_TRACKS,
  "Crabs and Traps": CRABS_AND_TRAPS_CHAPTER_TRACKS,
};
