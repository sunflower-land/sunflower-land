import calendar from "assets/icons/calendar.png";
import fruit from "assets/announcements/fruit.gif";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";

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
    date: new Date("2023-01-16T02:00:00"),
    title: "Weekly news",
    notes: [
      {
        text: "The team is working on Treasure Island!",
        icon: SUNNYSIDE.icons.hammer,
        link: {
          text: "Read more",
          url: "https://github.com/sunflower-land/sunflower-land/discussions/1956",
        },
      },
      {
        text: "Last week we reached our 100,000th trade listing at the Goblin Hot Air Baloon!",
        icon: SUNNYSIDE.icons.heart,
      },

      {
        text: `3000 Cyborg Bears will be on auction at Goblin retreat.`,
        icon: ITEM_DETAILS["Cyborg Bear"].image,
        date: new Date("2023-01-17T00:30:00.000Z"),
      },
      {
        text: `Join the weekly team chat on Discord`,
        icon: SUNNYSIDE.icons.expression_chat,
        date: new Date("2023-01-17T04:30:00.000Z"),
        link: {
          url: "https://discord.com/invite/sunflowerland",
          text: "Join Discord",
        },
      },
      {
        text: `Don't miss out on the Bumpkin Luscious Hair.`,
        icon: SUNNYSIDE.icons.player,
        date: new Date("2023-01-19T04:30:00.000Z"),
        link: {
          url: "https://bumpkins.io",
          text: "Bumpkins.io",
        },
      },
      {
        text: `Watch the team at our Weekly Wrap up`,
        icon: SUNNYSIDE.icons.expression_chat,
        date: new Date("2023-01-19T23:00:00.000Z"),
        link: {
          url: "https://www.twitch.tv/0xsunflowerstudios",
          text: "Twitch",
        },
      },
      {
        text: "A surprise Chinese New Year special is coming...",
        icon: calendar,
        date: new Date("2023-01-21"),
        link: {
          text: "Read more",
          url: "https://github.com/sunflower-land/sunflower-land/discussions/1937",
        },
      },
    ],
  },
  {
    date: new Date("2023-01-11T02:00:00"),
    title: "Fruit is here!",
    notes: [
      {
        text: "Apple, orange, and blueberry seeds are now available! Seeds grow into fruit trees, which can be harvested a random amount of times to collect fruit!",
      },
      {
        text: "But don't get too attached, once you're done harvesting, you gotta cut them trees down to make room for new ones.",
      },
      {
        text: "Once you've collected enough fruit, you can sell it or turn it into them fancy smoothies at the smoothie shack!",
      },
    ],
    image: fruit,
    link: "https://docs.sunflower-land.com/player-guides/planting-and-harvesting/fruit",
  },
];
