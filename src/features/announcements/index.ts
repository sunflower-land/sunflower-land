import reindeer from "assets/announcements/christmas_banner.gif";

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
];
