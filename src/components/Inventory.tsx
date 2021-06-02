import React from 'react'
import apple from './images/food.png'
import avocado from './images/avocados/avocado.png'
import banana from './images/bananas/banana.png'
import coconut from './images/coconuts/coconut.png'
import { Inventory, Fruit } from './types/contract'
import './App.css'

interface Props {
    selectedFruit: Fruit
    onSelectFruit: (fruit: Fruit) => void
}

export const InventoryBox: React.FC<Props> = ({
    selectedFruit,
    onSelectFruit,
}) => {
    return (
        <div className='inventory'>
            <>
                <div className='fruit-box' onClick={() => onSelectFruit(Fruit.Apple)} style={selectedFruit == Fruit.Apple ? {
                    border: '1px solid white',
                } : {}}>
                    <img src={apple} />
                </div>
                <div className='fruit-box' onClick={() => onSelectFruit(Fruit.Avocado)} style={selectedFruit == Fruit.Avocado ? {
                    border: '1px solid white',
                } : {}}>
                    <img src={avocado} />
                </div>
                <div className='fruit-box' onClick={() => onSelectFruit(Fruit.Banana)} style={selectedFruit == Fruit.Banana ? {
                    border: '1px solid white',
                } : {}}>
                    <img src={banana} />
                </div>
                <div className='fruit-box' onClick={() => onSelectFruit(Fruit.Coconut)} style={selectedFruit == Fruit.Coconut ? {
                    border: '1px solid white',
                } : {}}>
                    <img src={coconut} />
                </div>
            </>
        </div>
    )
}
