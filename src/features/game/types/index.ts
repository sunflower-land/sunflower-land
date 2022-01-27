import { CRAFTABLES } from "./craftables";
import { CROPS, SEEDS } from "./crops";

const ITEMS = {
  ...CRAFTABLES,
  ...SEEDS,
  ...CROPS,
};

export const IDS = Object.values(ITEMS).map((item) => item.id);
