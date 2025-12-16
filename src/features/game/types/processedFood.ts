export type ProcessedFood = "Fish Flake" | "Fish Stick" | "Fish Oil";

export type ProcessedFoodDetails = {
  description: string;
};

export const PROCESSED_FOODS: Record<ProcessedFood, ProcessedFoodDetails> = {
  "Fish Flake": {
    description:
      "A processed fish ingredient used for crafting and guaranteeing catches.",
  },
  "Fish Stick": {
    description:
      "A sturdy processed fish ingredient used for crafting and guaranteeing catches.",
  },
  "Fish Oil": {
    description:
      "A refined fish ingredient used for crafting and guaranteeing catches.",
  },
};
