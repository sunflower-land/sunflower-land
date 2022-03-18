import Decimal from "decimal.js-light";

/**
 * Assumptions are based on a user can earn close to 50exp per day farming, 30exp chopping/mining
 */
export function getLevel(experience: Decimal) {
  // Around 3 months farming
  if (experience.gt(5000)) {
    return 10;
  }

  // Around 2 months farming
  if (experience.gt(3000)) {
    return 9;
  }

  // Around 6 weeks farming
  if (experience.gt(2000)) {
    return 8;
  }

  // Around 4 weeks farming
  if (experience.gt(1400)) {
    return 7;
  }

  // Around 3 weeks farming
  if (experience.gt(1100)) {
    return 6;
  }

  // Around 2 weeks farming
  if (experience.gt(700)) {
    return 5;
  }

  // Around 1 weeks farming
  if (experience.gt(350)) {
    return 4;
  }

  // Around three days farming
  if (experience.gt(150)) {
    return 3;
  }

  // Around one day farming
  if (experience.gt(50)) {
    return 2;
  }

  return 1;
}
