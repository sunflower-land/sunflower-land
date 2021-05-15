import React from 'react'
import apple from './images/food.png'
import avocado from './images/avocados/avocado.png'
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
            <>
                {
                        apples > 0 && (
                            <div className='fruit-box' onClick={() => onSelectFruit(Commodity.Apple)} style={selectedFruit == Commodity.Apple ? {
                                border: '1px solid white',
                            } : {}}>

                                    <img src={apple} />
                                    <p className='fruit-count'>{apples}</p>
                            </div>
                        )
                }
                    {
                        avocados > 0 && (
                            <div className='fruit-box' onClick={() => onSelectFruit(Commodity.Avocado)} style={selectedFruit == Commodity.Avocado ? {
                                border: '1px solid white',
                            } : {}}>
                                <img src={avocado} />
                                <p className='fruit-count'>{avocados}</p>
                            </div>
                        )
                    }
            </>
        </div>
    )
}
