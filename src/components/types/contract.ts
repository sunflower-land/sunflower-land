export enum Fruit {
    None = '0',
    Apple = '1',
    Avocado = '2',
    Banana = '3',
    Coconut = '4',
    Pineapple = '5',
    Money = '6',
    Diamond = '7',
}

export enum Charity {
    TheWaterProject = '0x060697E9d4EEa886EbeCe57A974Facd53A40865B',
    Heifer = '0xD3F81260a44A1df7A7269CF66Abd9c7e4f8CdcD1',
    CoolEarth = '0x3c8cB169281196737c493AfFA8F49a9d823bB9c5'
}

export interface Square {
    fruit: Fruit
    createdAt: number
}


export interface Inventory {
    apples: number;
    avocados: number
}

export interface Transaction {
    fruit: Fruit
    createdAt: number
    action: Action
    landIndex: number
}

export enum Action {
    Plant = 0,
    Harvest = 1
}
