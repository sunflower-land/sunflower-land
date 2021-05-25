import React from 'react'
import apple from './images/food.png'
import avocado from './images/avocados/avocado.png'
import banana from './images/bananas/banana.png'
import coconut from './images/coconuts/coconut.png'
import { Inventory, Commodity } from './types/contract'
import './App.css'

interface Props {
    selectedFruit: Commodity
    onSelectFruit: (fruit: Commodity) => void
}

export const InventoryBox: React.FC<Props> = ({
    selectedFruit,
    onSelectFruit,
}) => {
    return (
        <div className='inventory'>
            <>
                <div className='fruit-box' onClick={() => onSelectFruit(Commodity.Apple)} style={selectedFruit == Commodity.Apple ? {
                    border: '1px solid white',
                } : {}}>
                    <img src={apple} />
                </div>
                <div className='fruit-box' onClick={() => onSelectFruit(Commodity.Avocado)} style={selectedFruit == Commodity.Avocado ? {
                    border: '1px solid white',
                } : {}}>
                    <img src={avocado} />
                </div>
                <div className='fruit-box' onClick={() => onSelectFruit(Commodity.Banana)} style={selectedFruit == Commodity.Banana ? {
                    border: '1px solid white',
                } : {}}>
                    <img src={banana} />
                </div>
                <div className='fruit-box' onClick={() => onSelectFruit(Commodity.Coconut)} style={selectedFruit == Commodity.Coconut ? {
                    border: '1px solid white',
                } : {}}>
                    <img src={coconut} />
                </div>
            </>
        </div>
    )
}
