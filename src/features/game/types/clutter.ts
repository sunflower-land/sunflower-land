export type Garbage = "Trash" | "Dung" | "Weed";
export type Pest = "Anthill" | "Rat" | "Snail";

export type ClutterName = Garbage | Pest;

export const FARM_GARBAGE: Record<Garbage, unknown> = {
  Trash: {},
  Dung: {},
  Weed: {},
};

export const FARM_PEST: Record<Pest, unknown> = {
  Anthill: {},
  Rat: {},
  Snail: {},
};

export const CLUTTER: Record<ClutterName, unknown> = {
  ...FARM_GARBAGE,
  ...FARM_PEST,
};
