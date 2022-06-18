import chicken from "assets/announcements/chickens.gif";
import nugget from "assets/announcements/nugget.gif";
import nomad from "assets/announcements/nomad.gif";

export interface Announcement {
  date: Date;
  image?: string;
  title: string;
  notes: string[];
  link?: string;
}

/**
 * Announcements are shown in game after the `date`.
 */
export const ANNOUNCEMENTS: Announcement[] = [
  {
    date: new Date("Mon, 22 Jun 2022 22:30:00 GMT"),
    title: "Nomad Trader",
    notes: [
      "Find weekly offers",
      "Trade resources for items",
      "What would be the next offer?",
    ],
    image: nomad,
  },
  {
    date: new Date("Mon, 20 Jun 2022 22:30:00 GMT"),
    title: "Nugget is open for crafting!",
    notes: [
      "Gives a 25% increase to Gold Mines",
      "Price: 50 Gold, 300 SFL",
      "Supply: 1000",
    ],
    image: nugget,
  },
  {
    date: new Date(
      "Tue Jun 01 2022 10:06:50 GMT-0300 (Brasilia Standard Time)"
    ),
    title: "Chickens",
    notes: [
      "Craft chickens at the Barn",
      "Feed chickens wheat and collect eggs",
      "Craft a rare Chicken Coop to grow your egg empire",
      "Will you be lucky enough to find a mutant chicken in an egg?",
    ],
    link: "https://docs.sunflower-land.com/crafting-guide/farming-and-gathering#animals",
    image: chicken,
  },
];
