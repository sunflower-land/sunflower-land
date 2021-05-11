import React from 'react'
import apple from './images/food.png'
import { Inventory, Commodity } from './types/contract'
import './App.css'

interface Props {
    inventory: Inventory
    selectedFruit: Commodity
    onSelectFruit: (fruit: Commodity) => void
}

export const InventoryBox: React.FC<Props> = ({
    inventory: {
        apples,
        avocados
    },
    selectedFruit,
    onSelectFruit,
}) => {
    return (
        <div className='inventory'>

                    <div className='fruit-box' onClick={() => onSelectFruit(Commodity.Apple)} style={selectedFruit == Commodity.Apple ? {
                        border: '1px solid white',
                    } : {}}>
                    {
                        apples > 0 && (
                            <>
                            <img src={apple} />
                            <p className='fruit-count'>{apples}</p>
                            </>
                        )
                    }
                    </div>

        </div>
    )
}
