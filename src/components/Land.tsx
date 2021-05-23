import React from 'react'
import './App.css'
import { Field }  from './Field'
import { Commodity, Square } from './types/contract'

interface Props {
    land: Square[]
    onHarvest: (landIndex: number) => void
    onPlant: (landIndex: number) => void
}

export const Land: React.FC<Props> = ({ land, onHarvest, onPlant }) => {
    return (
        <div className='land'>
            {
                land.map((square, index) => (
                    <Field square={square} onClick={square.commodity === Commodity.None ? () => onPlant(index) : () => onHarvest(index)}/> 
                ))
            }
        </div>
    )
}
