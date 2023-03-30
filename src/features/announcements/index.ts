import { SUNNYSIDE } from "assets/sunnyside";
import loveLetter from "assets/icons/love_letter.png";
import solarFlare from "assets/announcements/solar_flare.png";
import resourceReboot from "assets/announcements/resource-reboot.png";
import token from "assets/icons/token_2.png";
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
  autoOpen?: boolean;
}

/**
 * Announcements are shown in game after the `date`.
 */
export const ANNOUNCEMENTS: Announcement[] = [
  {
    date: new Date("2023-03-30T00:00:00"),
    title: "The Resource Reboot",
    notes: [
      {
        text: "A magical rumble was heard in the mountainous regions of Sunflower Land and suddenly all of the natural resources were reorganized in a massive upheaval.",
        icon: SUNNYSIDE.icons.stressed,
      },
      {
        text: "You can visit your chest in your inventory and place your crops, trees, fruit & stones where you want!",
        icon: SUNNYSIDE.icons.treasure,
      },
      {
        text: "Any crops or fruit that were in progress, have been automatically sent to your inventory.",
        icon: SUNNYSIDE.icons.heart,
      },
    ],
    image: resourceReboot,
    link: "https://docs.sunflower-land.com/player-guides/land-expansion-and-resources",
    autoOpen: true,
  },
  {
    date: new Date("2023-03-30T00:00:00"),
    title: "Maintenance Mode",
    notes: [
      {
        text: "The team are working on exciting updates!",
        icon: SUNNYSIDE.icons.hammer,
      },
      {
        text: "Next week, we expect roughly 1 hour of downtime to make these updgrades",
        icon: SUNNYSIDE.icons.timer,
        date: new Date(
          "Mon April 3 2023 11:00:00 GMT+1100 (Australian Eastern Daylight Time)"
        ),
      },
      {
        text: "Thank you for your patience!",
        icon: SUNNYSIDE.icons.heart,
      },
    ],
  },

  {
    date: new Date("2023-03-08T00:00:00"),
    title: "Solar Flare Season Has Begun!",
    notes: [
      {
        text: "The weather is heating up and the solar flare season has started!",
      },
      {
        text: "You can earn Solar Flare Tickets by completing quests at Helios & fulfilling Grub Shop Orders.",
        icon: ITEM_DETAILS["Solar Flare Ticket"].image,
      },
      {
        text: "6 Rare SFTs are available to mint at Goblin Retreat!",
        icon: SUNNYSIDE.icons.hammer,
      },
      {
        text: "Only 7 weeks left to mint these items.",
        icon: SUNNYSIDE.icons.timer,
      },
    ],
    image: solarFlare,
    link: "https://docs.sunflower-land.com/player-guides/seasons/solar-flare",
  },
  {
    date: new Date("2023-03-06T00:00:00"),
    title: "Weekly news",
    notes: [
      {
        text: "Solar Flare Season is coming soon",
        icon: SUNNYSIDE.icons.happy,
        link: {
          url: "https://docs.sunflower-land.com/player-guides/seasons",
          text: "Read more",
        },
      },
      {
        text: "The Garbage Collector is now at Helios! You can sell old event items for SFL!",
        icon: token,
      },

      {
        text: `Rare Bumpkin.io wearables are selling out in seconds!`,
        icon: SUNNYSIDE.icons.heart,
        link: {
          url: "https://bumpkins.io/#/upcoming-drops",
          text: "Bumpkins.io",
        },
      },
      {
        text: "Party Rooms have made progress!",
        icon: SUNNYSIDE.icons.hammer,
        link: {
          url: "https://twitter.com/bumpkinbuilder/status/1632234596413878272",
          text: "Read more",
        },
      },
      {
        text: "4 new recipes have been added into the game. Yum!",
        icon: ITEM_DETAILS["Fancy Fries"].image,
      },
    ],
  },
  {
    date: new Date("2023-02-20T00:00:00"),
    title: "Weekly news",
    notes: [
      {
        text: "You can now earn Daily Rewards! Check out the treasure chest near the bottom of your island.",
        icon: SUNNYSIDE.icons.treasure,
      },
      {
        text: "More than 700,000 holes have been dug at Treasure Island. Hurry before the treasure runs out!",
        icon: ITEM_DETAILS["Sand Shovel"].image,
      },
      {
        text: `A new deposit system has been added to the game!`,
        icon: SUNNYSIDE.icons.hammer,
        link: {
          url: "https://docs.sunflower-land.com/economy/depositing-and-custody#depositing-sfl-and-items-onto-your-farm",
          text: "Read more",
        },
      },

      {
        text: `You are invited to a party at Pumpkin Plaza! Visit the island to the east to learn more.`,
        icon: CROP_LIFECYCLE.Pumpkin.ready,
        date: new Date("2023-02-21T04:30:00.000Z"),
      },

      {
        text: `A new season of rare pirate wearables starts this Thursday. Don't miss out!`,
        icon: SUNNYSIDE.icons.heart,
        link: {
          url: "https://bumpkins.io/#/upcoming-drops",
          text: "Bumpkins.io",
        },
      },
    ],
  },
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
];
