import sunflower from '../images/sunflower/sunflower.png'
import pumpkin from '../images/pumpkin/pumpkin.png'

import { Fruit } from '../types/contract'

export function getFruitImage(fruit: Fruit) {
    if (fruit === Fruit.Apple) {
        return sunflower
    }

    if (fruit === Fruit.Avocado) {
        return pumpkin
    }

    return pumpkin
}
