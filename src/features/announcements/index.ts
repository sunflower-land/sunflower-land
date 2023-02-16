import buck from "assets/icons/block_buck_detailed.png";
import { SUNNYSIDE } from "assets/sunnyside";
import loveLetter from "assets/icons/love_letter.png";
import { ITEM_DETAILS } from "features/game/types/images";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

export interface Announcement {
  date: Date;
  image?: string;
  title: string;
  notes: {
    text: string;
    date?: Date;
    icon?: string;
    link?: {
      text: string;
      url: string;
    };
  }[];
  link?: string;
  type?: "war" | "bumpkin";
}

/**
 * Announcements are shown in game after the `date`.
 */
export const ANNOUNCEMENTS: Announcement[] = [
  {
    date: new Date("2023-02-14T00:00:00"),
    title: "Valentine's Day Event",
    notes: [
      {
        text: "Love is in the air and a mysterious island has become available.",
      },
      {
        text: "For only 7 days, you can travel to Love Island and start your romantic quest! Your aim is to collect Love Letters and craft limited edition wearables and decorations.",
      },
    ],
    image: loveLetter,
    link: "https://docs.sunflower-land.com/player-guides/special-events/valentines-day",
  },
  {
    date: new Date("2023-02-10T00:00:00"),
    title: "Block Bucks are here",
    notes: [
      {
        text: "To help players save money on gas fees, we are launching Block Bucks!",
      },
      { text: "Block Bucks can be used to restock your shops instantly." },
      {
        text: "You can purchase Block Bucks in bulk (5 at a time) in a single transaction",
      },
      {
        text: "When you buy a Block Buck, all of your game progress will be stored on the Blockchain.",
      },
    ],
    image: buck,
    link: "https://docs.sunflower-land.com/fundamentals/blockchain-fundamentals#block-bucks",
  },
  {
    date: new Date("2023-02-13T02:00:00"),
    title: "Weekly news",
    notes: [
      {
        text: `Valentines Day Event is going live this week!`,
        icon: SUNNYSIDE.icons.heart,
      },
      {
        text: "We have introduced Block Bucks! Restock your shops instantly and save on gas fees.",
        icon: buck,
        link: {
          text: "Read more",
          url: "https://docs.sunflower-land.com/fundamentals/blockchain-fundamentals#block-bucks",
        },
      },
      {
        text: `Over 2,900 players minted the Striped Blue shirt on Treasure Island`,
        icon: SUNNYSIDE.icons.player,
        link: {
          text: "Read more",
          url: "https://docs.sunflower-land.com/player-guides/islands/treasure-island",
        },
      },
      {
        text: "Multiple Bumpkins are coming soon!",
        icon: SUNNYSIDE.icons.player,
        link: {
          text: "Read more",
          url: "https://github.com/sunflower-land/sunflower-land/discussions/2211",
        },
      },
      {
        text: `Join the weekly team chat on Discord`,
        icon: SUNNYSIDE.icons.expression_chat,
        date: new Date("2023-02-14T04:30:00.000Z"),
        link: {
          url: "https://discord.com/invite/sunflowerland",
          text: "Join Discord",
        },
      },
      {
        text: `Watch the team at our Weekly Wrap up`,
        icon: SUNNYSIDE.icons.expression_chat,
        date: new Date("2023-02-16T23:00:00.000Z"),
        link: {
          url: "https://www.twitch.tv/0xsunflowerstudios",
          text: "Twitch",
        },
      },
    ],
  },
  {
    date: new Date("2023-02-06T02:00:00"),
    title: "Weekly news",
    notes: [
      {
        text: "Tools now require less wood",
        icon: ITEM_DETAILS["Wood"].image,
        link: {
          text: "Read more",
          url: "https://github.com/sunflower-land/sunflower-land/discussions/1952",
        },
      },

      {
        text: `Treasure Island is ready this week`,
        icon: SUNNYSIDE.icons.treasure,
        date: new Date("2023-02-08T00:00:00.000Z"),
        link: {
          text: "Read more",
          url: "https://docs.sunflower-land.com/player-guides/islands/treasure-island",
        },
      },
      {
        text: `Join the weekly team chat on Discord`,
        icon: SUNNYSIDE.icons.expression_chat,
        date: new Date("2023-02-07T04:30:00.000Z"),
        link: {
          url: "https://discord.com/invite/sunflowerland",
          text: "Join Discord",
        },
      },
      {
        text: `Valentines Day Event is coming later this week!`,
        icon: SUNNYSIDE.icons.heart,
      },
      {
        text: "Tractors, Sprinklers & Wheelbarrows are coming soon.",
        icon: SUNNYSIDE.icons.hammer,
        link: {
          text: "Read more",
          url: "https://github.com/sunflower-land/sunflower-land/discussions/2148",
        },
      },

      {
        text: `Feeling fruity? Don't miss out on the Pineapple Shirt`,
        icon: SUNNYSIDE.icons.player,
        date: new Date("2023-02-08T22:30:00.000Z"),
        link: {
          url: "https://bumpkins.io",
          text: "Bumpkins.io",
        },
      },
      {
        text: `Watch the team at our Weekly Wrap up`,
        icon: SUNNYSIDE.icons.expression_chat,
        date: new Date("2023-02-09T23:00:00.000Z"),
        link: {
          url: "https://www.twitch.tv/0xsunflowerstudios",
          text: "Twitch",
        },
      },
    ],
  },

  {
    date: new Date("2023-01-30T02:00:00"),
    title: "Weekly news",
    notes: [
      {
        text: "Over 8,500 players completed the Lunar New Year Event!",
        icon: ITEM_DETAILS["Red Envelope"].image,
      },
      {
        text: `Treasure Island Beta Testing starts this week`,
        icon: SUNNYSIDE.icons.treasure,
      },

      {
        text: `The team is working on a new Auctioneer system - until then auctions will be paused at the Goblin Retreat`,
        icon: SUNNYSIDE.icons.neutral,
      },
      {
        text: `Join the weekly team chat on Discord`,
        icon: SUNNYSIDE.icons.expression_chat,
        date: new Date("2023-01-30T04:30:00.000Z"),
        link: {
          url: "https://discord.com/invite/sunflowerland",
          text: "Join Discord",
        },
      },
      {
        text: "Explore the world in the Pumpkin Plaza Prototype ",
        icon: CROP_LIFECYCLE.Pumpkin.crop,
        link: {
          text: "Read more",
          url: "https://docs.sunflower-land.com/player-guides/islands/pumpkin-plaza",
        },
      },

      {
        text: `Want to become a Blacksmith? Don't miss out on the Blacksmith Hair drop.`,
        icon: SUNNYSIDE.icons.player,
        date: new Date("2023-02-01T22:30:00.000Z"),
        link: {
          url: "https://bumpkins.io",
          text: "Bumpkins.io",
        },
      },
      {
        text: `Watch the team at our Weekly Wrap up`,
        icon: SUNNYSIDE.icons.expression_chat,
        date: new Date("2023-02-02T23:00:00.000Z"),
        link: {
          url: "https://www.twitch.tv/0xsunflowerstudios",
          text: "Twitch",
        },
      },
    ],
  },
];
