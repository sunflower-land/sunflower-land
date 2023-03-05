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
