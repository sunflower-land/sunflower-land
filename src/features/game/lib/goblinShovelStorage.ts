import Decimal from "decimal.js-light";

const GOBLIN_SHOVEL_KEY = "csa-ctoken-UNCCLSNEZVAT";

interface GoblinShovel {
  harvestCount: Decimal;
  goblinCount: Decimal;
  firstGoblinAt: Decimal;
}

export function recoverShovel() {
  const goblinShovel = getGoblinShovel();

  setGoblinShovel({
    ...goblinShovel,
    harvestCount: new Decimal(0),
    goblinCount: goblinShovel.goblinCount.add(1),
  });
}

export function getGoblinCount() {
  const goblinShovel = getGoblinShovel();

  return goblinShovel.goblinCount;
}

export function getHarvestCount() {
  const goblinShovel = getGoblinShovel();

  return goblinShovel.harvestCount;
}

export function getGoblinShovel(): GoblinShovel {
  const item = localStorage.getItem(GOBLIN_SHOVEL_KEY);
  const shovel = item ? JSON.parse(item) : {};

  return {
    harvestCount: new Decimal(shovel.harvestCount ?? 0),
    goblinCount: new Decimal(shovel.goblinCount ?? 0),
    firstGoblinAt: new Decimal(shovel.firstGoblinAt ?? Date.now()),
  };
}

export function setGoblinShovel(goblinShovel: GoblinShovel) {
  localStorage.setItem(GOBLIN_SHOVEL_KEY, JSON.stringify(goblinShovel));
}

export function shouldResetGoblin(firstGoblinAt: Decimal): boolean {
  const millisecondsElapsed = new Decimal(Date.now()).sub(firstGoblinAt);

  const timeThreshold = new Decimal(24 * 60 * 60 * 1000); // 24 hours

  return millisecondsElapsed.greaterThan(timeThreshold);
}

export function addToHarvestCount(add: number) {
  const goblinShovel = getGoblinShovel();

  if (shouldResetGoblin(goblinShovel.firstGoblinAt)) {
    setGoblinShovel({
      harvestCount: new Decimal(1),
      goblinCount: new Decimal(0),
      firstGoblinAt: new Decimal(Date.now()),
    });
  } else {
    setGoblinShovel({
      ...goblinShovel,
      harvestCount: goblinShovel.harvestCount.add(add),
    });
  }
}
