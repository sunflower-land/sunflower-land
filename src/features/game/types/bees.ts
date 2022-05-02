import Decimal from "decimal.js-light";

export type BeeName = "Bee" | "Voyager Bee";

export type Bee = {
  buyPrice: Decimal;
  energy: number;
  name: BeeName;
  description: string;
  cooldown: number;
};

export const BEES: () => Record<BeeName, Bee> = () => ({
  Bee: {
    buyPrice: new Decimal(5),
    energy: 5,
    name: "Bee",
    cooldown: 5* 60 *60,
    description: "Bee used to harvest honey",
  },
  "Voyager Bee": {
    buyPrice: new Decimal(15),
    energy: 10,
    name: "Voyager Bee",
    cooldown: 24* 60 *60,
    description: "Bee used to gather flower seeds",
  },
});
