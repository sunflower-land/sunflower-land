export const LEAGUE_NAMES = [
  "Sunflower 1",
  "Sunflower 2",
  "Sunflower 3",
  "Potato 4",
  "Potato 5",
  "Potato 6",
  "Pumpkin 7",
  "Pumpkin 8",
  "Pumpkin 9",
  "Carrot 10",
  "Carrot 11",
  "Carrot 12",
] as const;

export type LeagueName = (typeof LEAGUE_NAMES)[number];

export interface Leagues {
  currentLeague: LeagueName;
  previousLeague?: LeagueName;
  points: number;
  previousPoints?: number;
  leagueResetAt?: number;
}
