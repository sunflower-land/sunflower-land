import React from 'react'

import { Field }  from './Field'
import { Fruit, Square } from '../../types/contract'

interface Props {
    land: Square[]
    balance: number
    onHarvest: (landIndex: number) => void
    onPlant: (landIndex: number) => void
}

export const FirstBlock: React.FC<Props> = ({ land, balance, onHarvest, onPlant }) => {
    return (
        <>
           
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
        </>
    )
}
