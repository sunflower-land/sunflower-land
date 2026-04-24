export const PICKLED_CROPS = [
  "Pickled Radish",
  "Pickled Zucchini",
  "Pickled Tomato",
  "Pickled Cabbage",
  "Pickled Onion",
  "Pickled Pepper",
  "Pickled Broccoli",
] as const;

export type PickledCropName = (typeof PICKLED_CROPS)[number];
