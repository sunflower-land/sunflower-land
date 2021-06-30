import { Fruit } from '../types/contract'

const prices: Record<Fruit, number> = {
    [Fruit.None]: 0,
    [Fruit.Apple]: 0.02,
    [Fruit.Avocado]: 0.12,
    [Fruit.Banana]: 0.56,
    [Fruit.Coconut]: 2.30,
    [Fruit.Pineapple]: 6.40,
    [Fruit.Money]: 20,
    [Fruit.Diamond]: 250,
}

export function getSellPrice(fruit: Fruit) {
    return prices[fruit]
}
