import React from 'react'

import './Land.css'

import { Square, Fruit } from '../../types/contract'

import waterEdge from '../../images/water/edge.png'

import { FirstBlock } from './FirstBlock'
import { SecondLand } from './SecondBlock'
import { ThirdBlock } from './ThirdBlock'
import { FourthBlock } from './FourthBlock'
import { FifthBlock } from './FifthBlock'
import { Tiles } from './Tiles'
import { Barn } from './Barn'
import { Blacksmith } from './Blacksmith'
import { Market } from './Market'

interface Props {
    land: Square[]
    balance: number
    onHarvest: (landIndex: number) => void
    onPlant: (landIndex: number) => void
    selectedFruit: Fruit
}

const columns = Array(60).fill(null)
const rows = Array(20).fill(null)

export const Land: React.FC<Props> = ({ land, balance, onHarvest, onPlant, selectedFruit }) => {
    return (
        <>
                    {
                columns.map((_, column) =>
                    rows.map((_, row) => (
                        ((column + row) %  2)
                            ? null
                            : (
                                <div className='grass1' style={{
                                    position: 'absolute',
                                    left: `calc(${(column - 25) * 62.5}px + 18px)`,
                                    top: `${(row) * 62.5}px`,
                                    width: '62.5px',
                                    height: '62.5px',
                                    background: '#5fc24b',
                                }} />
                            )
                    ))
                )
            }
            <div className='farm'>
                <FirstBlock selectedFruit={selectedFruit} land={land} balance={balance} onHarvest={onHarvest} onPlant={onPlant}/>
                <SecondLand selectedFruit={selectedFruit} land={land} balance={balance} onHarvest={onHarvest} onPlant={onPlant}/>
                <ThirdBlock selectedFruit={selectedFruit} land={land} balance={balance} onHarvest={onHarvest} onPlant={onPlant}/>
                <FourthBlock selectedFruit={selectedFruit} land={land} balance={balance} onHarvest={onHarvest} onPlant={onPlant}/>
                <FifthBlock selectedFruit={selectedFruit} land={land} balance={balance} onHarvest={onHarvest} onPlant={onPlant}/>
                <Barn farmSize={land.length} balance={balance} />
                <Blacksmith />
                <Market />
                <Tiles />

                {/* {
                    land.map((square, index) => (
                        <Field square={square} onClick={square.fruit === Fruit.None ? () => onPlant(index) : () => onHarvest(index)}/> 
                    ))
                } */}
            </div>

            {/* Water */}
            {
                new Array(50).fill(null).map((_, index) => (
                    <img className='water-edge' src={waterEdge} style={{
                        position: 'absolute',
                        left: `${index * 62.5}px`,
                    }} />
                ))
            }

            <div id="water" />
        </>
    )
}
