import React from 'react'
import './App.css'
import './Land.css'
import { Field }  from './Field'
import { Fruit, Square } from './types/contract'

interface Props {
    land: Square[]
    onHarvest: (landIndex: number) => void
    onPlant: (landIndex: number) => void
}

const grid = Array(16).fill(null)

export const Land: React.FC<Props> = ({ land, onHarvest, onPlant }) => {
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
            <div className='rock' style={{ gridColumn: '2/3', gridRow: '3/4'}} />
            <div className='rock' style={{ gridColumn: '4/5', gridRow: '7/8'}} />
            <div className='tree-stump' style={{ gridColumn: '6/7', gridRow: '1/2'}} />

            <div className='dirt-corner1' style={{ gridColumn: '6/7', gridRow: '7/8'}} />
            <div className='dirt-corner2' style={{ gridColumn: '8/9', gridRow: '7/8'}} />
            <div className='dirt-corner3' style={{ gridColumn: '8/9', gridRow: '9/10'}} />
            <div className='dirt-corner' style={{ gridColumn: '6/7', gridRow: '9/10'}} />

            <div className='dirt' style={{ gridColumn: '7/8', gridRow: '7/8'}}>
                <Field square={land[0]} onClick={land[0].fruit === Fruit.None ? () => onPlant(0) : () => onHarvest(0)}/> 
            </div>
            <div className='dirt' style={{ gridColumn: '6/7', gridRow: '8/9'}}>
                <Field square={land[1]} onClick={land[1].fruit === Fruit.None ? () => onPlant(1) : () => onHarvest(1)}/> 

            </div> 
            <div className='dirt' style={{ gridColumn: '7/8', gridRow: '8/9'}}>
                <Field square={land[2]} onClick={land[2].fruit === Fruit.None ? () => onPlant(2) : () => onHarvest(2)}/> 
            </div>
            <div className='dirt' style={{ gridColumn: '8/9', gridRow: '8/9'}}>
                <Field square={land[3]} onClick={land[3].fruit === Fruit.None ? () => onPlant(3) : () => onHarvest(3)}/> 

            </div> 
            <div className='dirt' style={{ gridColumn: '7/8', gridRow: '9/10'}}>
                <Field square={land[4]} onClick={land[4].fruit === Fruit.None ? () => onPlant(4) : () => onHarvest(4)}/> 
            </div> 

            <div className='left-edge' style={{ gridArea: '8 / 5 / 9 / 6' }} />
            <div className='right-edge' style={{ gridArea: '8 / 9 / 9 / 10' }} />
            <div className='top-edge' style={{ gridArea: '6 / 7 / 7 / 8' }} />
            <div className='bottom-edge' style={{ gridArea: '10 / 7 / 11 / 8' }} />
            <div className='top-corner' style={{ gridArea: '6 / 8 / 7 / 9' }} />
            <div className='top-corner2' style={{ gridArea: '6 / 6 / 7 / 7' }} />


            <div className='dirt' style={{ gridColumn: '12/13', gridRow: '8/9'}}>
            </div>
            <div className='dirt' style={{ gridColumn: '13/14', gridRow: '8/9'}}>
            </div>
            <div className='dirt' style={{ gridColumn: '13/14', gridRow: '9/10'}}>
            </div>

            <div className='left-edge' style={{ gridArea: '8 / 11 / 9 / 12' }} />
            <div className='left-edge' style={{ gridArea: '9 / 12 / 10 / 13' }} />
            <div className='right-edge' style={{ gridArea: '8 / 14 / 9 / 15' }} />
            <div className='right-edge' style={{ gridArea: '9 / 14 / 10 / 15' }} />

            <div className='bottom-edge' style={{ gridArea: '9 / 12 / 10 / 13' }} />
            <div className='bottom-edge' style={{ gridArea: '10 / 13 / 11 / 14' }} />
            <div className='top-edge' style={{ gridArea: '7 / 12 / 8 / 13' }} />
            <div className='top-edge' style={{ gridArea: '7 / 13 / 8 / 14' }} />


            {/* {
                land.map((square, index) => (
                    <Field square={square} onClick={square.fruit === Fruit.None ? () => onPlant(index) : () => onHarvest(index)}/> 
                ))
            } */}
        </div>
    )
}
