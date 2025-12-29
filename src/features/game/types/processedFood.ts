export type ProcessedFood = "Fish Flake" | "Fish Stick" | "Fish Oil";

export type ProcessedFoodDetails = {
  description: string;
};

export const PROCESSED_FOODS: Record<ProcessedFood, ProcessedFoodDetails> = {
  "Fish Flake": {
    description:
      "A processed fish ingredient with many benefits but the most important is guaranteeing catches.",
  },
  "Fish Stick": {
    description:
      "A sturdy processed fish ingredient with many benefits but the most important is guaranteeing catches.",
  },
  "Fish Oil": {
    description:
      "A refined fish ingredient with many benefits but the most important is guaranteeing catches.",
  },
};
