import sunflower from "assets/crops/sunflower/crop.png";
import potato from "assets/crops/potato/crop.png";

export type Item = {
  name: string;
  description: string;
  image: any;
  count: number;
};

// MOCKED
export const ITEMS: Item[] = [
  {
    name: "Sunflower",
    description: "A beautiful sunflower",
    image: sunflower,
    count: 5,
  },
  {
    name: "Potato",
    description: "A beautiful potato",
    image: potato,
    count: 2,
  },
];
