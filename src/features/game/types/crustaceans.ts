export type WaterTrapName = "Crab Pot" | "Mariner Pot";

type WaterTrap = {
  readyTimeHours: number;
  requiredBumpkinLevel: number;
};

export const WATER_TRAP: Record<WaterTrapName, WaterTrap> = {
  "Crab Pot": {
    readyTimeHours: 4,
    requiredBumpkinLevel: 18,
  },
  "Mariner Pot": {
    readyTimeHours: 8,
    requiredBumpkinLevel: 24,
  },
};

export type CrustaceanName =
  | "Isopod"
  | "Blue Crab"
  | "Lobster"
  | "Hermit Crab"
  | "Shrimp"
  | "Mussel"
  | "Oyster"
  | "Anemone"
  | "Barnacle"
  | "Sea Slug"
  | "Sea Snail"
  | "Garden Eel"
  | "Sea Grapes"
  | "Octopus"
  | "Sea Urchin"
  | "Horseshoe Crab";
