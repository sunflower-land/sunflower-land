import React from 'react'
import './App.css'
import './Land.css'
import { Field }  from './Field'
import { Pickaxe }  from './Pickaxe'
import { Fruit, Square } from './types/contract'

import { FirstBlock } from './FirstBlock'
import { SecondLand } from './SecondLand'
import { ThirdBlock } from './ThirdBlock'
import { FourthBlock } from './FourthBlock'
interface Props {
    land: Square[]
    balance: number
    onHarvest: (landIndex: number) => void
    onPlant: (landIndex: number) => void
}

const grid = Array(16).fill(null)

export const Land: React.FC<Props> = ({ land, balance, onHarvest, onPlant }) => {
    return (
        <div className='farm'>
            {
                grid.map((_, column) =>
                    grid.map((_, row) => (
                            <div className={
                                (column + row) %  2 ? 'grass' : 'grass1'
                            } style={{ gridColumn: `${column}/${column + 1}`, gridRow: `${row}/${row + 1}`}} />
                        )
                    )
                )
            }
            <FirstBlock land={land} balance={balance} onHarvest={onHarvest} onPlant={onPlant}/>
            <SecondLand land={land} balance={balance} onHarvest={onHarvest} onPlant={onPlant}/>
            <ThirdBlock land={land} balance={balance} onHarvest={onHarvest} onPlant={onPlant}/>
            <FourthBlock land={land} balance={balance} onHarvest={onHarvest} onPlant={onPlant}/>


            {/* {
                land.map((square, index) => (
                    <Field square={square} onClick={square.fruit === Fruit.None ? () => onPlant(index) : () => onHarvest(index)}/> 
                ))
            } */}
        </div>
    )
}
