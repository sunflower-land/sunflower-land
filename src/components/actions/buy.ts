import { Fruit } from '../types/contract'

const prices: Record<Fruit, number> = {
    [Fruit.None]: 0,
    [Fruit.Apple]: 0.01,
    [Fruit.Avocado]: 0.06,
    [Fruit.Banana]: 0.20,
    [Fruit.Coconut]: 1,
    [Fruit.Pineapple]: 2,
    [Fruit.Money]: 10,
    [Fruit.Diamond]: 200,
}

export function getBuyPrice(fruit: Fruit) {
    return prices[fruit]
}

export function getRequireLevel(fruit: Fruit) {
    switch (fruit) {
        case Fruit.Apple: 
        case Fruit.Avocado: return 1;
        case Fruit.Banana: 
        case Fruit.Coconut: return 2;
        case Fruit.Pineapple: return 2;
        case Fruit.Money: return 3;
        case Fruit.Diamond: return 4;
        default: return 4;
    }
}
