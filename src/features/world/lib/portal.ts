// Imports

import IMG_Island1 from "assets/portal/map-images/island_1.png";
import IMG_Island2 from "assets/portal/map-images/island_2.png";
import IMG_Island3 from "assets/portal/map-images/island_3.png";
import IMG_Island4 from "assets/portal/map-images/island_4.png";

// Types
export type PortalMapT = {
  name: string;
  type: "island" | "beach";
  price: number; // in SFL - 0 means free
  metadata: {
    title: string;
    description: string;
    image: string;
  };
};

// Exports

export const PORTAL_MAPS = [
  {
    name: "Island 1",
    type: "island",
    price: 0,
    metadata: {
      title: "Island 1",
      description:
        "A beautiful island with a lot of space for your dream place.",
      image: IMG_Island1,
    },
  },
  {
    name: "Island 2",
    type: "island",
    price: 0,
    metadata: {
      title: "Island 2",
      description:
        "A beautiful island with a lot of space for your dream place.",
      image: IMG_Island2,
    },
  },
  {
    name: "Island 3",
    type: "island",
    price: 10,
    metadata: {
      title: "Island 3",
      description:
        "A beautiful island with a lot of space for your dream place.",
      image: IMG_Island3,
    },
  },
  {
    name: "Island 4",
    type: "island",
    price: 25,
    metadata: {
      title: "Island 4",
      description:
        "A beautiful island with a lot of space for your dream place.",
      image: IMG_Island4,
    },
  },
] as PortalMapT[];
