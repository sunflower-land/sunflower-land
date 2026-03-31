export const SPICE_RACK_PRODUCTS = [
  "Salt Lick",
  "Honey Treat",
  "Spice Base",
  "Spiced Cheese",
] as const;

export type SpiceRackProductName = (typeof SPICE_RACK_PRODUCTS)[number];
