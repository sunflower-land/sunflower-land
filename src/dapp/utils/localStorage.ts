import { Fruit } from "../types/contract";

interface FarmState {
    selectedFruit: Fruit
}

// Account ID -> FarmState
type CachedFarms = Record<string, FarmState>

const CACHED_FARMS_KEY = 'farms'

const DEFAULT: FarmState = {
    selectedFruit: Fruit.Sunflower
}

function getFarms(): CachedFarms {
    const stored = localStorage.getItem(CACHED_FARMS_KEY)

    if (!stored) {
        return {}
    }

    return JSON.parse(stored)
}

export function getFarm(accountId: string): FarmState {
    const stored = localStorage.getItem(CACHED_FARMS_KEY)

    if (!stored) {
        return DEFAULT
    }

    const farms: CachedFarms = JSON.parse(stored)
    const farm = farms[accountId]

    if (!farm) {
        return DEFAULT
    }

    return farm
}

export function cacheAccountFarm(accountId: string, state: FarmState) {
    const farms = getFarms()
    const newFarms: CachedFarms = {
        ...farms,
        [accountId]: state,
    }

    localStorage.setItem(CACHED_FARMS_KEY, JSON.stringify(newFarms))
}