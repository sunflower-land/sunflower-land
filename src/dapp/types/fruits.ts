
import { Fruit } from './contract'


import sunflower from '../images/sunflower/fruit.png'
import pumpkin from '../images/pumpkin/fruit.png'
import beetroot from '../images/beetroot/fruit.png'
import cauliflower from '../images/cauliflower/fruit.png'
import potato from '../images/potato/fruit.png'

interface Item {
    fruit: Fruit
    name: string
    image: string
    buyPrice: number
    sellPrice: number
    landRequired: number
    harvestHours: number
}

export const fruits: Item[] = [{
    fruit: Fruit.Apple,
    name: 'Sunflower',
    image: sunflower,
    buyPrice: 0.01,
    sellPrice: 0.02,
    landRequired: 5,
    harvestHours: 1
}, {
    fruit: Fruit.Avocado,
    name: 'Pumpkin',
    image: pumpkin,
    buyPrice: 0.06,
    sellPrice: 0.12,
    landRequired: 5,
    harvestHours: 3
}, {
    fruit: Fruit.Banana,
    name: 'Beetroot',
    image: beetroot,
    buyPrice: 0.20,
    sellPrice: 0.56,
    landRequired: 8,
    harvestHours: 8
}, {
    fruit: Fruit.Coconut,
    name: 'Cauliflower',
    image: cauliflower,
    buyPrice: 1,
    sellPrice: 2.30,
    landRequired: 8,
    harvestHours: 24
}, {
    fruit: Fruit.Pineapple,
    name: 'Potato',
    image: potato,
    buyPrice: 2,
    sellPrice: 6.40,
    landRequired: 11,
    harvestHours: 72
}, {
    fruit: Fruit.Money,
    name: 'Money (BETA)',
    image: potato,
    buyPrice: 10,
    sellPrice: 20,
    landRequired: 14,
    harvestHours: 168
}, {
    fruit: Fruit.Pineapple,
    name: 'Diamond (BETA)',
    image: potato,
    buyPrice: 200,
    sellPrice: 250,
    landRequired: 17,
    harvestHours: 672
}]

export function getFruit(fruit: Fruit) {
    return fruits.find(item => item.fruit === fruit)
}
