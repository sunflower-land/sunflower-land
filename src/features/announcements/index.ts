import calendar from "assets/icons/calendar.png";
import fruit from "assets/announcements/fruit.gif";
import luckySign from "assets/events/lunar-new-year/luck_sign.png";
import goldenCockerel from "assets/sfts/golden_cockerel.gif";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/items";
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
    date: new Date("2023-01-23T02:00:00"),
    title: "Weekly news",
    notes: [
      {
        text: "Over 26,000 red envelopes have been discovered in the past 3 days",
        icon: ITEM_DETAILS["Red Envelope"].image,
      },
      {
        text: `The Golden Egg hatched last week to uncover a rare Golden Cockerel!`,
        icon: goldenCockerel,
      },
      {
        text: "Harry the Carrot Counter joins our team full time!",
        icon: CROP_LIFECYCLE.Carrot.crop,
      },
      {
        text: "Maneki Neko is now available to craft at Goblin Retreat",
        icon: ITEM_DETAILS["Maneki Neko"].image,
      },

      {
        text: `1000 Wood Nymphs will be on auction at Goblin retreat.`,
        icon: ITEM_DETAILS["Wood Nymph Wendy"].image,
        date: new Date("2023-01-25T00:30:00.000Z"),
      },

      {
        text: `Join the weekly team chat on Discord`,
        icon: SUNNYSIDE.icons.expression_chat,
        date: new Date("2023-01-23T04:30:00.000Z"),
        link: {
          url: "https://discord.com/invite/sunflowerland",
          text: "Join Discord",
        },
      },
      {
        text: `Don't miss out on the Bumpkin Mountain View Background.`,
        icon: SUNNYSIDE.icons.player,
        date: new Date("2023-01-26T04:30:00.000Z"),
        link: {
          url: "https://bumpkins.io",
          text: "Bumpkins.io",
        },
      },
      {
        text: `Watch the team at our Weekly Wrap up`,
        icon: SUNNYSIDE.icons.expression_chat,
        date: new Date("2023-01-26T23:00:00.000Z"),
        link: {
          url: "https://www.twitch.tv/0xsunflowerstudios",
          text: "Twitch",
        },
      },
    ],
  },

  {
    date: new Date("2023-01-18T00:00:00"),
    title: "Happy Lunar New Year",
    notes: [
      { text: "Let's celebrate the year of the Rabbit." },
      { text: "A special island has appeared west of main land." },
      {
        text: "Collect Red Envelopes to mint Bumpkin wearables or craft Maneki Neko on Goblin Retreat's Blacksmith.",
      },
      {
        text: "Each day a different resource will provide Red Envelopes.",
      },
      {
        text: "Visit the new years island NPC to find out more.",
      },
    ],
    image: luckySign,
    link: "https://docs.sunflower-land.com/player-guides/special-events/lunar-new-year",
  },

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
        text: "A surprise Lunar New Year special is coming...",
        icon: calendar,
        date: new Date("2023-01-20"),
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
