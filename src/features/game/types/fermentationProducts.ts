export const FERMENTATION_PRODUCTS = [
  "Greenhouse Glow",
  "Greenhouse Goodie",
  "Sproutroot Surprise",
  "Turbofruit Mix",
] as const;

export type FermentationProductName = (typeof FERMENTATION_PRODUCTS)[number];
