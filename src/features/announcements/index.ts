interface Announcement {
  date: Date;
  image?: string;
  title: string;
  description: string;
}

export const announcements: Announcement[] = [
  {
    date: new Date(
      "Tue Jun 07 2022 10:06:50 GMT-0300 (Brasilia Standard Time)"
    ),
    description: "jajaja",
    title: "Chickens",
    image: "bla",
  },
];
