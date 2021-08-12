import React from 'react'


import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

import soil from '../../images/land/soil/planted.png'

import { UpgradeOverlay } from '../ui/UpgradeModal'

import { Fruit, Square } from '../../types/contract'

import { Field }  from './Field'

interface Props {
    land: Square[]
    balance: number
    onHarvest: (landIndex: number) => void
    onPlant: (landIndex: number) => void
}

export const SecondLand: React.FC<Props> = ({ land, balance, onHarvest, onPlant }) => {
    const isUnlocked = land.length > 5
    console.log({ land })

    return (
        <>
            <div className='dirt' style={{ gridColumn: '2/3', gridRow: '8/9'}}>
                {
                    isUnlocked
                        ? (<Field square={land[5]} onClick={land[5].fruit === Fruit.None ? () => onPlant(5) : () => onHarvest(5)}/> )
                        : <div className='field'><img  src={soil} /></div>
                }
            </div>
            <div className='dirt' style={{ gridColumn: '3/4', gridRow: '9/10'}}>
                {
                    isUnlocked
                        ? (<Field square={land[6]} onClick={land[6].fruit === Fruit.None ? () => onPlant(6) : () => onHarvest(6)}/> )
                        : <div className='field'><img  src={soil} /></div>
                }
            </div>
            <div className='dirt' style={{ gridColumn: '2/3', gridRow: '9/10'}}>
                {
                    isUnlocked
                        ? (<Field square={land[7]} onClick={land[7].fruit === Fruit.None ? () => onPlant(7) : () => onHarvest(7)}/> )
                        : <div className='field'><img  src={soil} /></div>
                }
            </div>
            <div className='dirt' style={{ gridColumn: '3/4', gridRow: '8/9'}} />


            <div className='left-edge' style={{ gridColumn: '1/2', gridRow: '8/9'}} />
            <div className='left-edge' style={{ gridColumn: '1/2', gridRow: '9/10'}} />
            <div className='right-edge' style={{ gridColumn: '4/5', gridRow: '9/10'}}  />
            <div className='top-edge' style={{ gridColumn: '2/3', gridRow: '7/8'}} />
            <div className='top-edge' style={{ gridColumn: '3/4', gridRow: '7/8'}} />
            <div className='bottom-edge' style={{ gridColumn: '2/3', gridRow: '10/11'}} />
            <div className='bottom-edge' style={{ gridColumn: '3/4', gridRow: '10/11'}} />

            {
                !isUnlocked && (
                    <OverlayTrigger  overlay={UpgradeOverlay} placement="bottom" delay={{ show: 250, hide: 400 }}>
                        <div className='upgrade-overlay' style={{ gridColumn: '2/3', gridRow: '8/9' }} />
                    </OverlayTrigger>
                )
            }
        </>
    )
}
