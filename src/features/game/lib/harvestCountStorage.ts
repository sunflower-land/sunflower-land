import Decimal from "decimal.js-light";

const HARVEST_COUNT_KEY = "harvestCount";

export function recoverShovel() {
  localStorage.removeItem(HARVEST_COUNT_KEY);
}

export function getHarvestCount() {
  return localStorage.getItem(HARVEST_COUNT_KEY) || "0";
}

export function addToHarvestCount(add: number) {
  localStorage.setItem(
    HARVEST_COUNT_KEY,
    new Decimal(getHarvestCount()).add(add).toString()
  );
}
