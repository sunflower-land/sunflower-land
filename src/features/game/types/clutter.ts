export type Garbage = "Trash" | "Dung" | "Weed";
export type Pest = "Anthill" | "Rat" | "Snail";

export type ClutterName = Garbage | Pest;

export const FARM_GARBAGE: Record<Garbage, { sellUnit: number }> = {
  Trash: { sellUnit: 10 },
  Dung: { sellUnit: 30 },
  Weed: { sellUnit: 5 },
};

export const FARM_PEST: Record<Pest, { sellUnit: number }> = {
  Anthill: { sellUnit: 1 },
  Rat: { sellUnit: 1 },
  Snail: { sellUnit: 1 },
};

export const CLUTTER: Record<ClutterName, { sellUnit: number }> = {
  ...FARM_GARBAGE,
  ...FARM_PEST,
};
