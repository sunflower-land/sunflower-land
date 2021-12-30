import {
  ActionableItem,
  ACTIONABLE_ITEMS,
  Fruit,
} from "../types/contract";
import { FRUITS } from "../types/fruits";

interface FarmState {
  selectedItem?: string;
}

// Account ID -> FarmState
type CachedFarms = Record<string, FarmState>;

const CACHED_FARMS_KEY = "farms";

const DEFAULT: FarmState = {
  selectedItem: FRUITS[0].name,
};

function getFarms(): CachedFarms {
  const stored = localStorage.getItem(CACHED_FARMS_KEY);

  if (!stored) {
    return {};
  }

  try {
    const parsed = JSON.parse(stored);

    return parsed;
  } catch (e) {
    console.error("Parsing localstorage failed: ", e);
    return {};
  }
}

export function getFarm(accountId: string): FarmState {
  const farms = getFarms();
  const farm = farms[accountId];

  if (!farm) {
    return DEFAULT;
  }

  return farm;
}

export function cacheAccountFarm(accountId: string, state: FarmState) {
  const farms = getFarms();
  const newFarms: CachedFarms = {
    ...farms,
    [accountId]: state,
  };

  localStorage.setItem(CACHED_FARMS_KEY, JSON.stringify(newFarms));
}

export function getSelectedItem(accountId: string): ActionableItem {
  const farms = getFarms();

  const farm = farms[accountId];

  if (!farm || !farm.selectedItem) {
    return FRUITS[0];
  }

  const item = ACTIONABLE_ITEMS.find(
    (item) => item.name === farm.selectedItem
  );

  return item;
}

const ONBOARDED_KEY = "onboarded_time";

/**
 * Once a user has saved their farm
 */
export function onboarded() {
  localStorage.setItem(ONBOARDED_KEY, Date.now().toString());
}

export function hasOnboarded() {
  return !!localStorage.getItem(ONBOARDED_KEY);
}
