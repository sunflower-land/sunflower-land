import chicken from "assets/animals/chickens/walking.gif";
export interface Announcement {
  date: Date;
  image?: string;
  title: string;
  description: string;
  link?: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    date: new Date(
      "Tue Jun 01 2022 10:06:50 GMT-0300 (Brasilia Standard Time)"
    ),
    title: "Chickens",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    link: "https://docs.sunflower-land.com/",
    image: chicken,
  },
  {
    date: new Date(
      "Tue Jun 02 2022 10:06:50 GMT-0300 (Brasilia Standard Time)"
    ),
    title: "Land Expansion",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
  },
];
