import chicken from "assets/animals/chickens/walking.gif";
interface Announcement {
  date: Date;
  image?: string;
  title: string;
  description: string;
  link?: string;
}

export const announcements: Announcement[] = [
  {
    date: new Date(
      "Tue Jun 01 2022 10:06:50 GMT-0300 (Brasilia Standard Time)"
    ),
    title: "Chickens",
    description: "Chickens will be launched.... yada yada",
    link: "https://docs.sunflower-land.com/",
    image: chicken,
  },
  {
    date: new Date(
      "Tue Jun 02 2022 10:06:50 GMT-0300 (Brasilia Standard Time)"
    ),
    title: "Land Expansion",
    description: "Land Expansion will be launched.... yada yada",
  },
  {
    date: new Date(
      "Tue Jun 03 2022 10:06:50 GMT-0300 (Brasilia Standard Time)"
    ),
    title: "Bla bla",
    description: "YEAD",
    image: chicken,
  },
  {
    date: new Date(
      "Tue Jun 04 2022 10:06:50 GMT-0300 (Brasilia Standard Time)"
    ),
    title: "Bla bla",
    description: "YEAD",
    image: chicken,
  },
];
