export type Land =
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;

export interface Requirements {
  bumpkinLevel: number;
}

const LAND_4_REQUIREMENTS: Requirements = { bumpkinLevel: 1 };
const LAND_5_REQUIREMENTS: Requirements = { bumpkinLevel: 3 };
const LAND_6_REQUIREMENTS: Requirements = { bumpkinLevel: 4 };
const LAND_7_REQUIREMENTS: Requirements = { bumpkinLevel: 6 };
const LAND_8_REQUIREMENTS: Requirements = { bumpkinLevel: 8 };
const LAND_9_REQUIREMENTS: Requirements = { bumpkinLevel: 11 };
const LAND_10_REQUIREMENTS: Requirements = { bumpkinLevel: 13 };
const LAND_11_REQUIREMENTS: Requirements = { bumpkinLevel: 15 };
const LAND_12_REQUIREMENTS: Requirements = { bumpkinLevel: 17 };
const LAND_13_REQUIREMENTS: Requirements = { bumpkinLevel: 20 };
const LAND_14_REQUIREMENTS: Requirements = { bumpkinLevel: 23 };
const LAND_15_REQUIREMENTS: Requirements = { bumpkinLevel: 26 };
const LAND_16_REQUIREMENTS: Requirements = { bumpkinLevel: 30 };
const LAND_17_REQUIREMENTS: Requirements = { bumpkinLevel: 34 };
const LAND_18_REQUIREMENTS: Requirements = { bumpkinLevel: 37 };
const LAND_19_REQUIREMENTS: Requirements = { bumpkinLevel: 40 };
const LAND_20_REQUIREMENTS: Requirements = { bumpkinLevel: 45 };
const LAND_21_REQUIREMENTS: Requirements = { bumpkinLevel: 50 };
const LAND_22_REQUIREMENTS: Requirements = { bumpkinLevel: 55 };
const LAND_23_REQUIREMENTS: Requirements = { bumpkinLevel: 60 };

export const EXPANSION_REQUIREMENTS: Record<Land, Requirements> = {
  4: LAND_4_REQUIREMENTS,
  5: LAND_5_REQUIREMENTS,
  6: LAND_6_REQUIREMENTS,
  7: LAND_7_REQUIREMENTS,
  8: LAND_8_REQUIREMENTS,
  9: LAND_9_REQUIREMENTS,
  10: LAND_10_REQUIREMENTS,
  11: LAND_11_REQUIREMENTS,
  12: LAND_12_REQUIREMENTS,
  13: LAND_13_REQUIREMENTS,
  14: LAND_14_REQUIREMENTS,
  15: LAND_15_REQUIREMENTS,
  16: LAND_16_REQUIREMENTS,
  17: LAND_17_REQUIREMENTS,
  18: LAND_18_REQUIREMENTS,
  19: LAND_19_REQUIREMENTS,
  20: LAND_20_REQUIREMENTS,
  21: LAND_21_REQUIREMENTS,
  22: LAND_22_REQUIREMENTS,
  23: LAND_23_REQUIREMENTS,
};
