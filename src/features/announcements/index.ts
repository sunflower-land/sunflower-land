import reindeer from "assets/announcements/christmas_banner.gif";
import fruit from "assets/announcements/fruit.gif";

export interface Announcement {
  date: Date;
  image?: string;
  title: string;
  notes: string[];
  link?: string;
  type?: "war" | "bumpkin";
}

/**
 * Announcements are shown in game after the `date`.
 */
export const ANNOUNCEMENTS: Announcement[] = [
  {
    date: new Date("2022-12-20T00:00:00"),
    title: "Reinder Quest",
    notes: ["A mysterious Reindeer has appeared to the South."],
    image: reindeer,
  },
  {
    date: new Date("2023-01-10T00:00:00"),
    title: "Fruit Trees are here!",
    notes: [
      "Apple, orange, and blueberry seeds are now available! Seeds grow into fruit trees, which can be harvested a random amount of times to collect fruit!",
      "But don't get too attached, once you're done harvesting, you gotta cut them trees down to make room for new ones.",
      "Once you've collected enough fruit, you can sell it or turn it into them fancy smoothies at the smoothie shack!",
    ],
    image: fruit,
    link: "https://docs.sunflower-land.com/player-guides/planting-and-harvesting/fruit",
  },
];
